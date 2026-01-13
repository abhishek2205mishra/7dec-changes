import { Server } from "socket.io"
import { createMeetingSummary, completeMeetingSummary } from "../services/meetingSummary.service.js";
import {
    saveMeetingState,
    getMeetingState,
    updateParticipantStatus,
    addChatMessage,
    handleReconnection,
    closeMeetingState
} from "../services/meetingState.service.js";


let connections = {}
let messages = {}
let timeOnline = {}
let meetingParticipants = {}

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });


    io.on("connection", (socket) => {

        console.log("SOMETHING CONNECTED")

        socket.on("join-call", async (path) => {

            if (connections[path] === undefined) {
                connections[path] = []
                await createMeetingSummary(path);
            }
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            if (meetingParticipants[path] === undefined) {
                meetingParticipants[path] = [];
            }
            meetingParticipants[path].push({
                socketId: socket.id,
                joinTime: new Date()
            });

            await updateParticipantStatus(path, socket.id, 'connected', {
                joinTime: new Date()
            });

            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
            }

            const savedState = await getMeetingState(path);
            if (savedState && savedState.chatHistory && savedState.chatHistory.length > 0) {
                for (let a = 0; a < savedState.chatHistory.length; ++a) {
                    io.to(socket.id).emit("chat-message",
                        savedState.chatHistory[a]['data'],
                        savedState.chatHistory[a]['sender'],
                        savedState.chatHistory[a]['socketId'])
                }
            } else if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }

        })

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", async (data, sender) => {

            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {


                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];

                }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                const messageData = {
                    'sender': sender,
                    "data": data,
                    "socket-id-sender": socket.id,
                    "timestamp": new Date()
                };

                messages[matchingRoom].push(messageData);

                await addChatMessage(matchingRoom, {
                    sender: sender,
                    data: data,
                    socketId: socket.id,
                    timestamp: new Date()
                });

                console.log("message", matchingRoom, ":", sender, data)

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }

        })

        socket.on("disconnect", async () => {

            var diffTime = Math.abs(timeOnline[socket.id] - new Date())

            var key

            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {

                for (let a = 0; a < v.length; ++a) {
                    if (v[a] === socket.id) {
                        key = k

                        await updateParticipantStatus(key, socket.id, 'disconnected', {
                            lastSeen: new Date()
                        });

                        if (meetingParticipants[key]) {
                            const participant = meetingParticipants[key].find(p => p.socketId === socket.id);
                            if (participant) {
                                participant.leaveTime = new Date();
                                participant.timeSpent = participant.leaveTime - participant.joinTime;
                            }
                        }

                        for (let a = 0; a < connections[key].length; ++a) {
                            io.to(connections[key][a]).emit('user-left', socket.id)
                        }

                        var index = connections[key].indexOf(socket.id)

                        connections[key].splice(index, 1)


                        if (connections[key].length === 0) {
                            const meetingMessages = messages[key] || [];
                            const participants = meetingParticipants[key] || [];

                            await completeMeetingSummary(key, participants, meetingMessages);
                            await closeMeetingState(key);

                            delete connections[key]
                            delete messages[key]
                            delete meetingParticipants[key]
                        }
                    }
                }

            }


        })

        socket.on("reconnect-to-call", async (path, oldSocketId) => {
            console.log(`Reconnection attempt: ${oldSocketId} -> ${socket.id} in ${path}`);

            if (connections[path] === undefined) {
                connections[path] = []
            }

            const oldIndex = connections[path].indexOf(oldSocketId);
            if (oldIndex !== -1) {
                connections[path].splice(oldIndex, 1);
            }

            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            await handleReconnection(path, oldSocketId, socket.id);

            if (meetingParticipants[path]) {
                const participant = meetingParticipants[path].find(p => p.socketId === oldSocketId);
                if (participant) {
                    participant.socketId = socket.id;
                    participant.reconnectTime = new Date();
                }
            }

            for (let a = 0; a < connections[path].length; a++) {
                if (connections[path][a] !== socket.id) {
                    io.to(connections[path][a]).emit("user-reconnected", oldSocketId, socket.id);
                }
            }

            const savedState = await getMeetingState(path);
            if (savedState) {
                io.to(socket.id).emit("meeting-state-restored", {
                    chatHistory: savedState.chatHistory,
                    participants: savedState.participants,
                    transcript: savedState.transcript
                });
            }
        });


    })


    return io;
}

