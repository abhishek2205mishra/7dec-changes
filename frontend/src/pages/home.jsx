import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, TextField, Container, Box, Typography, Card, CardContent, Fade, Tooltip, Grid, Chip } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CloudIcon from '@mui/icons-material/Cloud';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 50% 20%, rgba(102,126,234,0.3) 0%, transparent 40%)',
                pointerEvents: 'none'
            }} />

            <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                animation: 'float 6s ease-in-out infinite',
                '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-30px)' }
                }
            }} />

            <Box sx={{
                position: 'absolute',
                bottom: '10%',
                right: '5%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(240,147,251,0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(50px)',
                animation: 'float 8s ease-in-out infinite',
                animationDelay: '2s'
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 3
                }}>
                    <Fade in timeout={800}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '50%',
                                p: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <VideoCallIcon sx={{ fontSize: 40, color: 'white' }} />
                            </Box>
                            <Typography variant="h4" sx={{
                                color: 'white',
                                fontWeight: 700,
                                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                letterSpacing: '-0.5px'
                            }}>
                                Virtual Meeting
                            </Typography>
                        </Box>
                    </Fade>

                    <Fade in timeout={1000}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Tooltip title="Meeting History">
                                <Button
                                    startIcon={<RestoreIcon />}
                                    onClick={() => navigate("/history")}
                                    sx={{
                                        color: 'white',
                                        textTransform: 'none',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        px: 3,
                                        py: 1,
                                        borderRadius: 3,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.2)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    History
                                </Button>
                            </Tooltip>

                            <Tooltip title="Admin Dashboard">
                                <Button
                                    startIcon={<AdminPanelSettingsIcon />}
                                    onClick={() => navigate("/admin")}
                                    sx={{
                                        color: 'white',
                                        textTransform: 'none',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, rgba(255,215,0,0.3) 0%, rgba(255,140,0,0.3) 100%)',
                                        backdropFilter: 'blur(10px)',
                                        px: 3,
                                        py: 1,
                                        borderRadius: 3,
                                        border: '1px solid rgba(255,215,0,0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, rgba(255,215,0,0.5) 0%, rgba(255,140,0,0.5) 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 20px rgba(255,215,0,0.3)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Admin
                                </Button>
                            </Tooltip>

                            <Button
                                startIcon={<LogoutIcon />}
                                onClick={() => {
                                    localStorage.removeItem("token")
                                    navigate("/auth")
                                }}
                                sx={{
                                    color: 'white',
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    px: 3,
                                    borderRadius: 3,
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.1)',
                                        borderColor: 'white',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Fade>
                </Box>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 'calc(100vh - 120px)',
                    gap: 8,
                    flexWrap: 'wrap',
                    py: 4
                }}>
                    <Fade in timeout={1200}>
                        <Box sx={{ flex: 1, minWidth: '400px' }}>
                            <Chip
                                icon={<SecurityIcon />}
                                label="Secure & Encrypted"
                                sx={{
                                    mb: 3,
                                    background: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    color: 'white',
                                    fontWeight: 600,
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    '& .MuiChip-icon': {
                                        color: 'white'
                                    }
                                }}
                            />

                            <Typography variant="h2" sx={{
                                color: 'white',
                                fontWeight: 800,
                                mb: 3,
                                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                lineHeight: 1.2,
                                fontSize: { xs: '2.5rem', md: '3.5rem' }
                            }}>
                                Connect, Collaborate & Create Together
                            </Typography>

                            <Typography variant="h6" sx={{
                                color: 'rgba(255,255,255,0.95)',
                                mb: 5,
                                fontWeight: 400,
                                lineHeight: 1.6
                            }}>
                                Experience seamless video conferencing with crystal clear quality, real-time chat, and powerful collaboration tools
                            </Typography>

                            <Card sx={{
                                background: 'rgba(255,255,255,0.98)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 4,
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                p: 3,
                                border: '1px solid rgba(255,255,255,0.5)'
                            }}>
                                <CardContent>
                                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#333' }}>
                                        Join or Start a Meeting
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                                        <TextField
                                            onChange={e => setMeetingCode(e.target.value)}
                                            value={meetingCode}
                                            label="Enter Meeting Code"
                                            variant="outlined"
                                            fullWidth
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && meetingCode.trim()) {
                                                    handleJoinVideoCall();
                                                }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': {
                                                        borderColor: '#667eea',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#667eea',
                                                        borderWidth: '2px'
                                                    }
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: '#667eea'
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={handleJoinVideoCall}
                                            variant='contained'
                                            disabled={!meetingCode.trim()}
                                            fullWidth
                                            startIcon={<VideoCallIcon />}
                                            sx={{
                                                py: 1.8,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontSize: '18px',
                                                fontWeight: 700,
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                                '&:hover': {
                                                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
                                                    transform: 'translateY(-3px)'
                                                },
                                                '&:disabled': {
                                                    background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                                                    color: 'white'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Join Meeting Now
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Grid container spacing={3} sx={{ mt: 4 }}>
                                <Grid item xs={6} sm={4}>
                                    <Box sx={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: 3,
                                        p: 2,
                                        textAlign: 'center',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.25)',
                                            transform: 'translateY(-5px)'
                                        }
                                    }}>
                                        <GroupsIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                                            Multi-User
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: 3,
                                        p: 2,
                                        textAlign: 'center',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.25)',
                                            transform: 'translateY(-5px)'
                                        }
                                    }}>
                                        <ScreenShareIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                                            Screen Share
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: 3,
                                        p: 2,
                                        textAlign: 'center',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.25)',
                                            transform: 'translateY(-5px)'
                                        }
                                    }}>
                                        <ChatIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                                            Live Chat
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: 3,
                                        p: 2,
                                        textAlign: 'center',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.25)',
                                            transform: 'translateY(-5px)'
                                        }
                                    }}>
                                        <SecurityIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                                            Encrypted
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>

                    <Fade in timeout={1400}>
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minWidth: '300px'
                        }}>
                            <Box
                                component="img"
                                src="/logo3.png"
                                alt="Virtual Meeting"
                                sx={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    maxHeight: '600px',
                                    borderRadius: 4,
                                    boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                                    transition: 'transform 0.5s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05) rotate(2deg)'
                                    }
                                }}
                            />
                        </Box>
                    </Fade>
                </Box>
            </Container>
        </Box>
    )
}

export default withAuth(HomeComponent)
