import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CssBaseline, IconButton,
    Badge, Tooltip, Divider,
    Menu, MenuItem, ListItemText
} from '@mui/material';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';

import { Navigate, Route, Routes } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import TeacherSideBar from './TeacherSideBar';
import Logout from '../Logout';
import AccountMenu from '../../components/AccountMenu';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';
import TeacherClassDetails from './TeacherClassDetails';
import TeacherComplain from './TeacherComplain';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherViewStudent from './TeacherViewStudent';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const TeacherDashboard = () => {

    const [open, setOpen] = useState(true);

    // ✅ NOTIFICATION STATES
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    // ✅ FETCH NOTIFICATIONS
    useEffect(() => {
        axios.get("http://localhost:5000/teacher-notifications")
            .then(res => {
                console.log("TEACHER NOTIFICATIONS:", res.data);
                setNotifications(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    // ✅ HANDLERS
    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <DashboardRoot>
            <CssBaseline />

            {/* Sidebar */}
            <TeacherSideBar collapsed={!open} />

            <MainArea>
                {/* Top Bar */}
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

                        <PageTitle>Teacher Dashboard</PageTitle>
                    </BarLeft>

                    <BarRight>

                        {/* 🔔 NOTIFICATION ICON */}
                        <Tooltip title="Notifications" arrow>
                            <IconButton
                                onClick={handleOpen}
                                size="small"
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

                        {/* 🔽 DROPDOWN */}
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

                {/* Content */}
                <ContentArea>
                    <Routes>
                        <Route path="/" element={<TeacherHomePage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                        <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
                        <Route path="/Teacher/profile" element={<TeacherProfile />} />
                        <Route path="/Teacher/complain" element={<TeacherComplain />} />
                        <Route path="/Teacher/class" element={<TeacherClassDetails />} />
                        <Route path="/Teacher/class/student/:id" element={<TeacherViewStudent />} />
                        <Route
                            path="/Teacher/class/student/attendance/:studentID/:subjectID"
                            element={<StudentAttendance situation="Subject" />}
                        />
                        <Route
                            path="/Teacher/class/student/marks/:studentID/:subjectID"
                            element={<StudentExamMarks situation="Subject" />}
                        />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </ContentArea>
            </MainArea>
        </DashboardRoot>
    );
};

export default TeacherDashboard;

/* ================= STYLES ================= */

const DashboardRoot = styled.div`
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: #f8fafc;
`;

const MainArea = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const TopBar = styled.div`
    height: 64px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
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
`;

const ContentArea = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 28px;
    animation: ${fadeIn} 0.35s ease both;
`;