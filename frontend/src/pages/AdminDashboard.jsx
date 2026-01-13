import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Snackbar,
    FormControlLabel,
    Checkbox,
    Fade,
    Grow,
    AppBar,
    Toolbar,
    Tooltip
} from '@mui/material';
import {
    People,
    VideoCall,
    CheckCircle,
    PlayCircle,
    Delete,
    Add,
    Close,
    Home,
    TrendingUp,
    Assessment
} from '@mui/icons-material';
import { adminAPI } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function AdminDashboard() {
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [summaries, setSummaries] = useState([]);
    const [selectedSummary, setSelectedSummary] = useState(null);
    const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [newUser, setNewUser] = useState({ name: '', username: '', password: '', isAdmin: false });
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [statsData, usersData, meetingsData, summariesData] = await Promise.all([
                adminAPI.getDashboardStats(),
                adminAPI.getAllUsers(),
                adminAPI.getAllMeetings(),
                adminAPI.getAllMeetingSummaries()
            ]);
            
            setStats(statsData.stats);
            setUsers(usersData.users);
            setMeetings(meetingsData.meetings);
            setSummaries(summariesData.summaries);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data');
            if (err.response?.status === 403 || err.response?.status === 401) {
                setTimeout(() => navigate('/auth'), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This will also delete all their meetings.')) {
            try {
                await adminAPI.deleteUser(userId);
                setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
                loadDashboardData();
            } catch (err) {
                setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete user', severity: 'error' });
            }
        }
    };

    const handleDeleteMeeting = async (meetingId) => {
        if (window.confirm('Are you sure you want to delete this meeting?')) {
            try {
                await adminAPI.deleteMeeting(meetingId);
                setSnackbar({ open: true, message: 'Meeting deleted successfully', severity: 'success' });
                loadDashboardData();
            } catch (err) {
                setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete meeting', severity: 'error' });
            }
        }
    };

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.username || !newUser.password) {
            setSnackbar({ open: true, message: 'Please fill all fields', severity: 'error' });
            return;
        }

        try {
            await adminAPI.createUser(newUser);
            setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
            setOpenAddUserDialog(false);
            setNewUser({ name: '', username: '', password: '', isAdmin: false });
            loadDashboardData();
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to create user', severity: 'error' });
        }
    };

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        return `${minutes}m`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
            >
                <Box textAlign="center">
                    <CircularProgress size={60} sx={{ color: 'white' }} />
                    <Typography variant="h6" sx={{ color: 'white', mt: 2 }}>
                        Loading Dashboard...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                minHeight="100vh"
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Container maxWidth="sm">
                    <Alert severity="error" sx={{ borderRadius: 3, boxShadow: 3 }}>
                        {error}
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
            <AppBar position="static" sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <Toolbar>
                    <Assessment sx={{ mr: 2, fontSize: 32 }} />
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Admin Dashboard
                    </Typography>
                    <Tooltip title="Back to Home">
                        <IconButton color="inherit" onClick={() => navigate('/')}>
                            <Home />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Fade in timeout={800}>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Grow in timeout={600}>
                                <Card sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    borderRadius: 3,
                                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)'
                                    }
                                }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <Typography sx={{ opacity: 0.9, fontSize: '14px', fontWeight: 600 }} gutterBottom>
                                                    Total Users
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                                    {stats?.totalUsers || 0}
                                                </Typography>
                                            </Box>
                                            <People sx={{ fontSize: 56, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grow>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Grow in timeout={800}>
                                <Card sx={{
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: 'white',
                                    borderRadius: 3,
                                    boxShadow: '0 8px 24px rgba(245, 87, 108, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(245, 87, 108, 0.4)'
                                    }
                                }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <Typography sx={{ opacity: 0.9, fontSize: '14px', fontWeight: 600 }} gutterBottom>
                                                    Total Meetings
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                                    {stats?.totalSummaries || 0}
                                                </Typography>
                                            </Box>
                                            <VideoCall sx={{ fontSize: 56, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grow>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Grow in timeout={1000}>
                                <Card sx={{
                                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                    color: 'white',
                                    borderRadius: 3,
                                    boxShadow: '0 8px 24px rgba(79, 172, 254, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(79, 172, 254, 0.4)'
                                    }
                                }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <Typography sx={{ opacity: 0.9, fontSize: '14px', fontWeight: 600 }} gutterBottom>
                                                    Active Meetings
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                                    {stats?.activeMeetings || 0}
                                                </Typography>
                                            </Box>
                                            <PlayCircle sx={{ fontSize: 56, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grow>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Grow in timeout={1200}>
                                <Card sx={{
                                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                    color: 'white',
                                    borderRadius: 3,
                                    boxShadow: '0 8px 24px rgba(67, 233, 123, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(67, 233, 123, 0.4)'
                                    }
                                }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <Typography sx={{ opacity: 0.9, fontSize: '14px', fontWeight: 600 }} gutterBottom>
                                                    Completed
                                                </Typography>
                                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                                    {stats?.completedMeetings || 0}
                                                </Typography>
                                            </Box>
                                            <CheckCircle sx={{ fontSize: 56, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grow>
                        </Grid>
                    </Grid>
                </Fade>

            <Paper sx={{
                width: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            fontSize: '16px',
                            fontWeight: 600,
                            textTransform: 'none',
                            minHeight: 64,
                            transition: 'all 0.3s ease'
                        },
                        '& .Mui-selected': {
                            color: '#667eea'
                        },
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: '3px 3px 0 0',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }
                    }}
                >
                    <Tab label="Users" />
                    <Tab label="Meeting History" />
                    <Tab label="Meeting Summaries" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                            Users Management
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpenAddUserDialog(true)}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                py: 1.5,
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)'
                                }
                            }}
                        >
                            Add User
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{
                                    background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)'
                                }}>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Name
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Username
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Admin
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow
                                        key={user._id}
                                        sx={{
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: '#f7fafc',
                                                transform: 'scale(1.01)'
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                                        <TableCell sx={{ color: '#718096' }}>{user.username}</TableCell>
                                        <TableCell>
                                            {user.isAdmin ? (
                                                <Chip
                                                    label="Admin"
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        fontSize: '12px'
                                                    }}
                                                    size="small"
                                                />
                                            ) : (
                                                <Chip
                                                    label="User"
                                                    sx={{
                                                        backgroundColor: '#e2e8f0',
                                                        color: '#4a5568',
                                                        fontWeight: 600,
                                                        fontSize: '12px'
                                                    }}
                                                    size="small"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Delete User" arrow>
                                                <IconButton
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    size="small"
                                                    sx={{
                                                        color: '#e53e3e',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            backgroundColor: '#fff5f5',
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                            Meeting History
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{
                                    background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)'
                                }}>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Meeting Code
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        User
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Date
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {meetings.map((meeting) => (
                                    <TableRow
                                        key={meeting._id}
                                        sx={{
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: '#f7fafc',
                                                transform: 'scale(1.01)'
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Chip
                                                label={meeting.meetingCode}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: '13px'
                                                }}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{meeting.user_id}</TableCell>
                                        <TableCell sx={{ color: '#718096' }}>{formatDate(meeting.date)}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Delete Meeting" arrow>
                                                <IconButton
                                                    onClick={() => handleDeleteMeeting(meeting._id)}
                                                    size="small"
                                                    sx={{
                                                        color: '#e53e3e',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            backgroundColor: '#fff5f5',
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                            Meeting Summaries
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{
                                    background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)'
                                }}>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Meeting Code
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Start Time
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Duration
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Participants
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Status
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '14px', color: '#4a5568' }}>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {summaries && summaries.length > 0 ? (
                                    summaries.map((summary) => (
                                        <TableRow
                                            key={summary._id}
                                            sx={{
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: '#f7fafc',
                                                    transform: 'scale(1.01)'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Chip
                                                    label={summary.meetingCode}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        fontSize: '13px'
                                                    }}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: '#718096' }}>
                                                {formatDate(summary.startTime)}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>
                                                {summary.duration ? formatDuration(summary.duration) : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={summary.totalParticipants}
                                                    sx={{
                                                        backgroundColor: '#e6fffa',
                                                        color: '#047857',
                                                        fontWeight: 600
                                                    }}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={summary.status}
                                                    sx={{
                                                        backgroundColor: summary.status === 'active' ? '#d1fae5' : '#e2e8f0',
                                                        color: summary.status === 'active' ? '#065f46' : '#4a5568',
                                                        fontWeight: 600,
                                                        fontSize: '12px'
                                                    }}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    onClick={() => setSelectedSummary(summary)}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        color: 'white',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        borderRadius: 2,
                                                        px: 2,
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                                            transform: 'scale(1.05)'
                                                        }
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body1" sx={{ color: '#718096' }}>
                                                No meeting summaries available yet. Start a meeting to generate summaries.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {selectedSummary && (
                        <Fade in>
                            <Paper sx={{
                                mt: 4,
                                p: 4,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                                        Meeting Summary Details
                                    </Typography>
                                    <IconButton
                                        onClick={() => setSelectedSummary(null)}
                                        sx={{
                                            color: '#718096',
                                            '&:hover': {
                                                backgroundColor: '#e2e8f0',
                                                color: '#2d3748'
                                            }
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                                <Box sx={{
                                    backgroundColor: '#edf2f7',
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 3
                                }}>
                                    <Typography variant="body2" sx={{ color: '#4a5568', fontWeight: 600 }}>
                                        Meeting Code: <span style={{ color: '#667eea' }}>{selectedSummary.meetingCode}</span>
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mt: 2,
                                        whiteSpace: 'pre-line',
                                        color: '#4a5568',
                                        lineHeight: 1.8,
                                        fontSize: '15px'
                                    }}
                                >
                                    {selectedSummary.summary || 'No summary available'}
                                </Typography>
                                <Button
                                    sx={{
                                        mt: 3,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                                        }
                                    }}
                                    onClick={() => setSelectedSummary(null)}
                                >
                                    Close
                                </Button>
                            </Paper>
                        </Fade>
                    )}
                </TabPanel>
            </Paper>

            <Dialog
                open={openAddUserDialog}
                onClose={() => setOpenAddUserDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '20px',
                    py: 2.5
                }}>
                    Add New User
                    <IconButton
                        onClick={() => setOpenAddUserDialog(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.2)'
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 3, pb: 2 }}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        margin="normal"
                        sx={{
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
                    <TextField
                        fullWidth
                        label="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        margin="normal"
                        sx={{
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
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        margin="normal"
                        sx={{
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newUser.isAdmin}
                                onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                                sx={{
                                    color: '#667eea',
                                    '&.Mui-checked': {
                                        color: '#667eea'
                                    }
                                }}
                            />
                        }
                        label="Make Admin"
                        sx={{ mt: 2, color: '#4a5568', fontWeight: 500 }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => setOpenAddUserDialog(false)}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            color: '#718096',
                            borderRadius: 2,
                            px: 3,
                            '&:hover': {
                                backgroundColor: '#f7fafc'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddUser}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)'
                            }
                        }}
                    >
                        Add User
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
        </Box>
    );
}

export default AdminDashboard;
