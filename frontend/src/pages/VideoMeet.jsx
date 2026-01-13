import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Snackbar, Alert, Chip, Box, Typography, Card, CardContent, Avatar } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import server from '../environment';
import offlineRecoveryService from '../services/offlineRecovery.service';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();
    let oldSocketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    let [connectionStatus, setConnectionStatus] = useState('connected');
    let [isReconnecting, setIsReconnecting] = useState(false);
    let [showConnectionAlert, setShowConnectionAlert] = useState(false);
    let reconnectAttempts = useRef(0);
    let reconnectTimeout = useRef(null);

    let [fullscreenVideo, setFullscreenVideo] = useState(null);

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        console.log("HELLO")
        getPermissions();

    }, [])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            const meetingCode = window.location.href;

            if (oldSocketIdRef.current && isReconnecting) {
                socketRef.current.emit('reconnect-to-call', meetingCode, oldSocketIdRef.current);
                setIsReconnecting(false);
            } else {
                socketRef.current.emit('join-call', meetingCode);
            }

            socketIdRef.current = socketRef.current.id;
            setConnectionStatus('connected');
            setShowConnectionAlert(false);
            reconnectAttempts.current = 0;

            offlineRecoveryService.logConnection(meetingCode, 'connected', {
                socketId: socketRef.current.id,
                timestamp: new Date().toISOString()
            });

            socketRef.current.on('chat-message', (data, sender, socketIdSender) => {
                addMessage(data, sender, socketIdSender);
                offlineRecoveryService.saveChatMessage(meetingCode, {
                    sender,
                    data,
                    socketId: socketIdSender
                });
            });

            socketRef.current.on('meeting-state-restored', async (state) => {
                console.log('Meeting state restored:', state);

                if (state.chatHistory && state.chatHistory.length > 0) {
                    const restoredMessages = state.chatHistory.map(msg => ({
                        sender: msg.sender,
                        data: msg.data
                    }));
                    setMessages(restoredMessages);
                }

                await offlineRecoveryService.markMessagesSynced(meetingCode);
                setShowConnectionAlert(true);
            });

            socketRef.current.on('user-reconnected', (oldId, newId) => {
                console.log(`User reconnected: ${oldId} -> ${newId}`);

                if (connections[oldId]) {
                    connections[newId] = connections[oldId];
                    delete connections[oldId];
                }

                setVideos(videos => videos.map(video =>
                    video.socketId === oldId ? { ...video, socketId: newId } : video
                ));
            });

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
            setConnectionStatus('disconnected');
            setShowConnectionAlert(true);
            oldSocketIdRef.current = socketIdRef.current;

            offlineRecoveryService.logConnection(window.location.href, 'disconnected', {
                socketId: socketIdRef.current,
                timestamp: new Date().toISOString()
            });

            attemptReconnection();
        });

        socketRef.current.on('error', (error) => {
            console.error('Socket error:', error);
            setConnectionStatus('error');
            setShowConnectionAlert(true);
        });
    }

    const attemptReconnection = () => {
        if (reconnectAttempts.current >= 5) {
            setConnectionStatus('failed');
            setShowConnectionAlert(true);
            return;
        }

        setIsReconnecting(true);
        setConnectionStatus('reconnecting');
        reconnectAttempts.current += 1;

        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);

        reconnectTimeout.current = setTimeout(() => {
            console.log(`Reconnection attempt ${reconnectAttempts.current}`);

            offlineRecoveryService.logConnection(window.location.href, 'reconnecting', {
                attempt: reconnectAttempts.current,
                timestamp: new Date().toISOString()
            });

            if (socketRef.current) {
                socketRef.current.connect();
            }
        }, delay);
    };

    useEffect(() => {
        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };
    }, []);

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        const meetingCode = window.location.href;

        socketRef.current.emit('chat-message', message, username);

        offlineRecoveryService.saveChatMessage(meetingCode, {
            sender: username,
            data: message,
            socketId: socketIdRef.current
        });

        setMessage("");
    }

    
    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div>

            {askForUsername === true ?

                <Box sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '20px'
                }}>
                    <Card sx={{
                        maxWidth: 600,
                        width: '100%',
                        borderRadius: 4,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '40px 30px',
                            textAlign: 'center'
                        }}>
                            <Avatar sx={{
                                width: 80,
                                height: 80,
                                margin: '0 auto 20px',
                                background: 'rgba(255,255,255,0.2)',
                                fontSize: '36px',
                                fontWeight: 700
                            }}>
                                {username ? username.charAt(0).toUpperCase() : '?'}
                            </Avatar>
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                                Join Meeting
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                Enter your name to continue
                            </Typography>
                        </Box>

                        <CardContent sx={{ padding: '40px 30px' }}>
                            <TextField
                                fullWidth
                                label="Your Name"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                variant="outlined"
                                placeholder="Enter your display name"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && username.trim()) {
                                        connect();
                                    }
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover fieldset': {
                                            borderColor: '#667eea'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea'
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#667eea'
                                    }
                                }}
                            />

                            <Box sx={{
                                mb: 3,
                                borderRadius: 3,
                                overflow: 'hidden',
                                background: '#000',
                                position: 'relative',
                                paddingTop: '56.25%'
                            }}>
                                <video
                                    ref={localVideoref}
                                    autoPlay
                                    muted
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                ></video>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={connect}
                                disabled={!username.trim()}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    padding: '14px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                                    },
                                    '&:disabled': {
                                        background: '#e2e8f0',
                                        color: '#a0aec0'
                                    }
                                }}
                            >
                                Join Meeting
                            </Button>
                        </CardContent>
                    </Card>
                </Box> :


                <div className={styles.meetVideoContainer}>

                    {connectionStatus !== 'connected' && (
                        <div style={{
                            position: 'fixed',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 9999
                        }}>
                            <Chip
                                label={
                                    connectionStatus === 'reconnecting'
                                        ? `Reconnecting... (Attempt ${reconnectAttempts.current}/5)`
                                        : connectionStatus === 'disconnected'
                                        ? 'Connection Lost'
                                        : connectionStatus === 'failed'
                                        ? 'Reconnection Failed'
                                        : 'Connection Error'
                                }
                                color={
                                    connectionStatus === 'reconnecting' ? 'warning' : 'error'
                                }
                                sx={{
                                    fontSize: '14px',
                                    padding: '20px 15px',
                                    fontWeight: 'bold'
                                }}
                            />
                        </div>
                    )}

                    <Snackbar
                        open={showConnectionAlert}
                        autoHideDuration={6000}
                        onClose={() => setShowConnectionAlert(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={() => setShowConnectionAlert(false)}
                            severity={connectionStatus === 'connected' ? 'success' : 'warning'}
                            sx={{ width: '100%' }}
                        >
                            {connectionStatus === 'connected'
                                ? 'Reconnected! Your chat history has been restored.'
                                : 'Connection lost. Attempting to reconnect...'}
                        </Alert>
                    </Snackbar>

                    {showModal ? <div className={styles.chatRoom}>

                        <div className={styles.chatContainer}>
                            <h1>Chat</h1>

                            <div className={styles.chattingDisplay}>

                                {messages.length !== 0 ? messages.map((item, index) => {

                                    console.log(messages)
                                    return (
                                        <div className={styles.messageItem} key={index}>
                                            <p className={styles.messageSender}>{item.sender}</p>
                                            <p className={styles.messageData}>{item.data}</p>
                                        </div>
                                    )
                                }) : <p style={{ textAlign: 'center', color: '#9e9e9e', marginTop: '20px' }}>No Messages Yet</p>}


                            </div>

                            <div className={styles.chattingArea}>
                                <TextField
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    id="outlined-basic"
                                    label="Type a message"
                                    variant="outlined"
                                    fullWidth
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && message.trim()) {
                                            sendMessage();
                                        }
                                    }}
                                />
                                <Button variant='contained' onClick={sendMessage} disabled={!message.trim()}>Send</Button>
                            </div>


                        </div>
                    </div> : <></>}


                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} style={{ color: "white" }}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                            <CallEndIcon  />
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: "white" }}>
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: "white" }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>}

                        <Badge badgeContent={newMessages} max={999} color='orange'>
                            <IconButton onClick={() => setModal(!showModal)} style={{ color: "white" }}>
                                <ChatIcon />                        </IconButton>
                        </Badge>

                    </div>


                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>

                    <div className={fullscreenVideo ? styles.conferenceViewFullscreen : styles.conferenceView}>
                        {videos.map((video) => (
                            <div
                                key={video.socketId}
                                className={fullscreenVideo === video.socketId ? styles.videoFullscreen : styles.videoWrapper}
                            >
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                                <IconButton
                                    onClick={() => setFullscreenVideo(fullscreenVideo === video.socketId ? null : video.socketId)}
                                    className={styles.fullscreenButton}
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        background: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        '&:hover': {
                                            background: 'rgba(0,0,0,0.7)'
                                        }
                                    }}
                                >
                                    {fullscreenVideo === video.socketId ? <FullscreenExitIcon /> : <FullscreenIcon />}
                                </IconButton>
                            </div>

                        ))}

                    </div>

                </div>

            }

        </div>
    )
}
