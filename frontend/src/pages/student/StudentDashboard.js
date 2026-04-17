import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    CssBaseline, IconButton, Badge, Tooltip, Divider,
    Menu, MenuItem, ListItemText
} from '@mui/material';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';

import { Navigate, Route, Routes } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import StudentSideBar from './StudentSideBar';
import StudentHomePage from './StudentHomePage';
import StudentProfile from './StudentProfile';
import StudentSubjects from './StudentSubjects';
import ViewStdAttendance from './ViewStdAttendance';
import StudentComplain from './StudentComplain';
import Logout from '../Logout';
import AccountMenu from '../../components/AccountMenu';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const StudentDashboard = () => {

    const [open, setOpen] = useState(true);

    // ✅ FIX: hooks INSIDE component
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    // ✅ fetch notifications
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?._id) return;

        axios.get(`http://localhost:5000/notifications/${user._id}`)
            .then(res => {
                console.log("NOTIFICATIONS:", res.data); // debug
                setNotifications(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    // open / close menu
    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <DashboardRoot>
            <CssBaseline />

            <StudentSideBar collapsed={!open} />

            <MainArea>
                <TopBar>
                    <BarLeft>
                        <Tooltip title={open ? 'Collapse sidebar' : 'Expand sidebar'} arrow>
                            <IconButton
                                onClick={() => setOpen(!open)}
                                size="small"
                                sx={{
                                    background: '#f1f5f9',
                                    borderRadius: '8px',
                                    width: 36,
                                    height: 36,
                                    '&:hover': { background: '#e2e8f0' },
                                }}
                            >
                                {open
                                    ? <MenuOpenRoundedIcon sx={{ fontSize: 20, color: '#475569' }} />
                                    : <MenuRoundedIcon sx={{ fontSize: 20, color: '#475569' }} />
                                }
                            </IconButton>
                        </Tooltip>
                        <PageTitle>Student Dashboard</PageTitle>
                    </BarLeft>

                    <BarRight>

                        {/* ✅ NOTIFICATION ICON */}
                        <Tooltip title="Notifications" arrow>
                            <IconButton
                                size="small"
                                onClick={handleOpen}
                                sx={{
                                    background: '#f1f5f9',
                                    borderRadius: '8px',
                                    width: 36,
                                    height: 36,
                                    '&:hover': { background: '#e2e8f0' }
                                }}
                            >
                                <Badge badgeContent={notifications.length} color="error">
                                    <NotificationsNoneRoundedIcon sx={{ fontSize: 18, color: '#475569' }} />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        {/* ✅ DROPDOWN */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {notifications.length > 0 ? (
                                notifications.map((note, index) => (
                                    <MenuItem key={index}>
                                        <ListItemText primary={note.message} />
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem>
                                    <ListItemText primary="No notifications" />
                                </MenuItem>
                            )}
                        </Menu>

                        <Divider orientation="vertical" flexItem sx={{ mx: '4px', borderColor: '#e2e8f0' }} />

                        <AccountMenu />
                    </BarRight>
                </TopBar>

                <ContentArea>
                    <Routes>
                        <Route path="/" element={<StudentHomePage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                        <Route path="/Student/dashboard" element={<StudentHomePage />} />
                        <Route path="/Student/profile" element={<StudentProfile />} />
                        <Route path="/Student/subjects" element={<StudentSubjects />} />
                        <Route path="/Student/attendance" element={<ViewStdAttendance />} />
                        <Route path="/Student/complain" element={<StudentComplain />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </ContentArea>
            </MainArea>
        </DashboardRoot>
    );
};

export default StudentDashboard;

// ─── Styled Components ────────────────────────────────────────────────────────
const DashboardRoot = styled.div`
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: #f8fafc;
    font-family: 'Plus Jakarta Sans', sans-serif;
`;

const MainArea = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
`;

const TopBar = styled.div`
    height: 64px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    flex-shrink: 0;
    gap: 16px;
`;

const BarLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
`;

const BarRight = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const PageTitle = styled.h1`
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.01em;
`;

const ContentArea = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 28px 32px;
    animation: ${fadeIn} 0.35s ease both;
    @media (max-width: 768px) { padding: 16px; }
    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: #f1f5f9; }
    &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
`;