import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Button, Card, Grid, Fade, Chip } from '@mui/material'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GroupsIcon from '@mui/icons-material/Groups'
import SecurityIcon from '@mui/icons-material/Security'
import ScreenShareIcon from '@mui/icons-material/ScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import HdIcon from '@mui/icons-material/Hd'

export default function LandingPage() {
    const router = useNavigate();

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
                width: '350px',
                height: '350px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(50px)',
                animation: 'float 7s ease-in-out infinite',
                '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                    '50%': { transform: 'translateY(-40px) translateX(20px)' }
                }
            }} />

            <Box sx={{
                position: 'absolute',
                bottom: '15%',
                right: '8%',
                width: '450px',
                height: '450px',
                background: 'radial-gradient(circle, rgba(240,147,251,0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 9s ease-in-out infinite',
                animationDelay: '3s'
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 3
                }}>
                    <Fade in timeout={600}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                background: 'rgba(255,255,255,0.25)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '50%',
                                p: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                            }}>
                                <VideoCallIcon sx={{ fontSize: 42, color: 'white' }} />
                            </Box>
                            <Typography variant="h4" sx={{
                                color: 'white',
                                fontWeight: 800,
                                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                                letterSpacing: '-0.5px'
                            }}>
                                Virtual Meeting
                            </Typography>
                        </Box>
                    </Fade>

                    <Fade in timeout={800}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                startIcon={<PersonAddIcon />}
                                onClick={() => router("/auth")}
                                sx={{
                                    color: 'white',
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    background: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(10px)',
                                    px: 3,
                                    py: 1,
                                    borderRadius: 3,
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.25)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Register
                            </Button>

                            <Button
                                startIcon={<LoginIcon />}
                                onClick={() => router("/auth")}
                                sx={{
                                    color: 'white',
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)',
                                    backdropFilter: 'blur(10px)',
                                    px: 4,
                                    py: 1,
                                    borderRadius: 3,
                                    border: '2px solid rgba(255,255,255,0.4)',
                                    boxShadow: '0 4px 20px rgba(255,255,255,0.2)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.25) 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 30px rgba(255,255,255,0.3)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Login
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
                    <Fade in timeout={1000}>
                        <Box sx={{ flex: 1, minWidth: '400px' }}>
                            <Chip
                                icon={<SecurityIcon />}
                                label="100% Secure & Private"
                                sx={{
                                    mb: 3,
                                    background: 'rgba(255,255,255,0.25)',
                                    backdropFilter: 'blur(10px)',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    '& .MuiChip-icon': {
                                        color: 'white'
                                    }
                                }}
                            />

                            <Typography variant="h1" sx={{
                                color: 'white',
                                fontWeight: 900,
                                mb: 3,
                                textShadow: '0 4px 30px rgba(0,0,0,0.4)',
                                lineHeight: 1.1,
                                fontSize: { xs: '3rem', md: '4.5rem' }
                            }}>
                                Connect with Your
                                <Box component="span" sx={{
                                    display: 'block',
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    Loved Ones
                                </Box>
                            </Typography>

                            <Typography variant="h5" sx={{
                                color: 'rgba(255,255,255,0.95)',
                                mb: 5,
                                fontWeight: 400,
                                lineHeight: 1.6
                            }}>
                                Experience crystal-clear video calls with powerful features. Connect instantly, share screens, and collaborate seamlessly.
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 3, mb: 6, flexWrap: 'wrap' }}>
                                <Button
                                    onClick={() => router("/auth")}
                                    variant='contained'
                                    size="large"
                                    startIcon={<LoginIcon />}
                                    sx={{
                                        py: 2,
                                        px: 5,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontSize: '20px',
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.5)',
                                        '&:hover': {
                                            boxShadow: '0 15px 50px rgba(102, 126, 234, 0.7)',
                                            transform: 'translateY(-3px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Get Started
                                </Button>

                                <Button
                                    onClick={() => router("/aljk23")}
                                    variant='outlined'
                                    size="large"
                                    startIcon={<GroupsIcon />}
                                    sx={{
                                        py: 2,
                                        px: 5,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontSize: '20px',
                                        fontWeight: 700,
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        borderWidth: '2px',
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': {
                                            borderColor: 'white',
                                            borderWidth: '2px',
                                            background: 'rgba(255,255,255,0.2)',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 10px 30px rgba(255,255,255,0.2)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Join as Guest
                                </Button>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Card sx={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: 3,
                                        p: 2.5,
                                        textAlign: 'center',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.25)',
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
                                        }
                                    }}>
                                        <HdIcon sx={{ fontSize: 45, color: 'white', mb: 1 }} />
                                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                                            HD Quality
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Card sx={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: 3,
                                        p: 2.5,
                                        textAlign: 'center',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.25)',
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
                                        }
                                    }}>
                                        <ScreenShareIcon sx={{ fontSize: 45, color: 'white', mb: 1 }} />
                                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                                            Screen Share
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Card sx={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: 3,
                                        p: 2.5,
                                        textAlign: 'center',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.25)',
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
                                        }
                                    }}>
                                        <ChatIcon sx={{ fontSize: 45, color: 'white', mb: 1 }} />
                                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                                            Live Chat
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Card sx={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: 3,
                                        p: 2.5,
                                        textAlign: 'center',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.25)',
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
                                        }
                                    }}>
                                        <SecurityIcon sx={{ fontSize: 45, color: 'white', mb: 1 }} />
                                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                                            Encrypted
                                        </Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>

                    <Fade in timeout={1200}>
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minWidth: '350px'
                        }}>
                            <Box
                                component="img"
                                src="/mobile.png"
                                alt="Virtual Meeting"
                                sx={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    maxHeight: '650px',
                                    filter: 'drop-shadow(0 30px 80px rgba(0,0,0,0.5))',
                                    transition: 'transform 0.5s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05) rotate(-2deg)'
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
