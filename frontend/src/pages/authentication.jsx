import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Alert, Tabs, Tab, Fade, Slide } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#667eea',
        },
        secondary: {
            main: '#764ba2',
        },
    },
});

export default function Authentication() {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');

    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                let result = await handleLogin(username, password);
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setName("");
                setMessage(result);
                setOpen(true);
                setError("");
                setFormState(0);
                setPassword("");
            }
        } catch (err) {
            console.log(err);
            let message = (err.response.data.message);
            setError(message);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAuth();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        position: 'relative',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }} />
                    <Fade in timeout={1000}>
                        <Box sx={{ 
                            textAlign: 'center', 
                            color: 'white', 
                            zIndex: 1,
                            px: 4
                        }}>
                            <Typography variant="h2" sx={{ 
                                fontWeight: 800, 
                                mb: 3,
                                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                            }}>
                                Welcome to Virtual Meeting
                            </Typography>
                            <Typography variant="h5" sx={{ 
                                fontWeight: 400,
                                opacity: 0.95,
                                maxWidth: '600px',
                                mx: 'auto'
                            }}>
                                Connect with anyone, anywhere. Experience seamless video conferencing with advanced features.
                            </Typography>
                        </Box>
                    </Fade>
                </Grid>
                
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fafafa'
                }}>
                    <Slide direction="left" in timeout={800}>
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '450px',
                                px: 4,
                                py: 6
                            }}
                        >
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                mb: 4
                            }}>
                                <Avatar sx={{ 
                                    m: 1, 
                                    width: 64, 
                                    height: 64,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
                                }}>
                                    {formState === 0 ? <LockOutlinedIcon sx={{ fontSize: 32 }} /> : <PersonAddIcon sx={{ fontSize: 32 }} />}
                                </Avatar>
                                <Typography component="h1" variant="h4" sx={{ 
                                    fontWeight: 700,
                                    color: '#333',
                                    mt: 2
                                }}>
                                    {formState === 0 ? 'Sign In' : 'Sign Up'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                                    {formState === 0 ? 'Welcome back! Please login to your account.' : 'Create a new account to get started.'}
                                </Typography>
                            </Box>

                            <Tabs 
                                value={formState} 
                                onChange={(e, newValue) => {
                                    setFormState(newValue);
                                    setError('');
                                }}
                                centered
                                sx={{ 
                                    mb: 4,
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        minWidth: 120
                                    }
                                }}
                            >
                                <Tab label="Sign In" />
                                <Tab label="Sign Up" />
                            </Tabs>

                            <Box component="form" noValidate>
                                {formState === 1 && (
                                    <Fade in timeout={500}>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="name"
                                            label="Full Name"
                                            name="name"
                                            value={name}
                                            autoFocus={formState === 1}
                                            onChange={(e) => setName(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                }
                                            }}
                                        />
                                    </Fade>
                                )}

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    value={username}
                                    autoFocus={formState === 0}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                                
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    value={password}
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    id="password"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />

                                {error && (
                                    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    sx={{ 
                                        mt: 3, 
                                        mb: 2,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={handleAuth}
                                    disabled={!username || !password || (formState === 1 && !name)}
                                >
                                    {formState === 0 ? "Sign In" : "Create Account"}
                                </Button>
                            </Box>
                        </Box>
                    </Slide>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}
