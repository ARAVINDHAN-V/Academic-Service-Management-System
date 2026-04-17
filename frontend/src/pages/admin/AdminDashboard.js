import { useState, useEffect } from 'react';
import {
    CssBaseline,
    IconButton,
    Badge,
    Tooltip,
    Divider,
    Menu,
    MenuItem,
    ListItemText
} from '@mui/material';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

// Components
import Logout from '../Logout';
import SideBar from './SideBar';
import AdminProfile from './AdminProfile';
import AdminHomePage from './AdminHomePage';
import AINoticeGenerator from "../AINoticeGenerator";
import AccountMenu from '../../components/AccountMenu';

// Student
import AddStudent from './studentRelated/AddStudent';
import SeeComplains from './studentRelated/SeeComplains';
import ShowStudents from './studentRelated/ShowStudents';
import StudentAttendance from './studentRelated/StudentAttendance';
import StudentExamMarks from './studentRelated/StudentExamMarks';
import ViewStudent from './studentRelated/ViewStudent';

// Notice
import AddNotice from './noticeRelated/AddNotice';
import ShowNotices from './noticeRelated/ShowNotices';

// Subject
import ShowSubjects from './subjectRelated/ShowSubjects';
import SubjectForm from './subjectRelated/SubjectForm';
import ViewSubject from './subjectRelated/ViewSubject';

// Teacher
import AddTeacher from './teacherRelated/AddTeacher';
import ChooseClass from './teacherRelated/ChooseClass';
import ChooseSubject from './teacherRelated/ChooseSubject';
import ShowTeachers from './teacherRelated/ShowTeachers';
import TeacherDetails from './teacherRelated/TeacherDetails';

// Class
import AddClass from './classRelated/AddClass';
import ClassDetails from './classRelated/ClassDetails';
import ShowClasses from './classRelated/ShowClasses';

// Animation
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const AdminDashboard = () => {

    const [open, setOpen] = useState(true);
    const { currentUser } = useSelector(state => state.user);

    // 🔔 Notifications
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/admin-notifications")
            .then(res => setNotifications(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <DashboardRoot>
            <CssBaseline />

            {/* Sidebar */}
            <SideBar collapsed={!open} />

            <MainArea>

                {/* Top Bar */}
                <TopBar>
                    <BarLeft>
                        <Tooltip title={open ? "Collapse sidebar" : "Expand sidebar"} arrow>
                            <IconButton
                                onClick={() => setOpen(!open)}
                                size="small"
                                sx={{
                                    background: "#f1f5f9",
                                    borderRadius: "8px",
                                    width: 36,
                                    height: 36,
                                    "&:hover": { background: "#e2e8f0" }
                                }}
                            >
                                {open
                                    ? <MenuOpenRoundedIcon sx={{ fontSize: 20, color: "#475569" }} />
                                    : <MenuRoundedIcon sx={{ fontSize: 20, color: "#475569" }} />
                                }
                            </IconButton>
                        </Tooltip>

                        <PageTitle>Admin Dashboard</PageTitle>
                    </BarLeft>

                    <BarRight>


                        {/* Notifications */}
                        <Tooltip title="Notifications" arrow>
                            <IconButton
                                onClick={handleOpen}
                                size="small"
                                sx={{
                                    background: "#f1f5f9",
                                    borderRadius: "8px",
                                    width: 36,
                                    height: 36,
                                    "&:hover": { background: "#e2e8f0" }
                                }}
                            >
                                <Badge badgeContent={notifications.length} color="error">
                                    <NotificationsNoneRoundedIcon sx={{ fontSize: 18, color: "#475569" }} />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        {/* Dropdown */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {notifications.length > 0 ? (
                                notifications.slice(0, 10).map((n, i) => (
                                    <MenuItem key={i}>
                                        <ListItemText primary={n.message} />
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem>
                                    <ListItemText primary="No notifications" />
                                </MenuItem>
                            )}
                        </Menu>

                        <Divider orientation="vertical" flexItem sx={{ mx: "4px" }} />

                        <AccountMenu />
                    </BarRight>
                </TopBar>

                {/* Content */}
                <ContentArea>
                    <Routes>
                        <Route path="/" element={<AdminHomePage />} />
                        <Route path="*" element={<Navigate to="/" />} />

                        <Route path="/Admin/dashboard" element={<AdminHomePage />} />
                        <Route path="/Admin/profile" element={<AdminProfile />} />
                        <Route path="/Admin/complains" element={<SeeComplains />} />

                        {/* Notice */}
                        <Route path="/Admin/addnotice" element={<AddNotice />} />
                        <Route path="/Admin/notices" element={<ShowNotices />} />
                        <Route path="/Admin/ai-notice" element={<AINoticeGenerator />} />

                        {/* Subjects */}
                        <Route path="/Admin/subjects" element={<ShowSubjects />} />
                        <Route path="/Admin/subjects/subject/:classID/:subjectID" element={<ViewSubject />} />
                        <Route path="/Admin/subjects/chooseclass" element={<ChooseClass situation="Subject" />} />
                        <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />

                        {/* Students */}
                        <Route path="/Admin/addstudents" element={<AddStudent situation="Student" />} />
                        <Route path="/Admin/students" element={<ShowStudents />} />
                        <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
                        <Route path="/Admin/students/student/attendance/:id" element={<StudentAttendance situation="Student" />} />
                        <Route path="/Admin/students/student/marks/:id" element={<StudentExamMarks situation="Student" />} />

                        {/* Teachers */}
                        <Route path="/Admin/teachers" element={<ShowTeachers />} />
                        <Route path="/Admin/teachers/teacher/:id" element={<TeacherDetails />} />
                        <Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher" />} />
                        <Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm" />} />
                        <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />

                        {/* Classes */}
                        <Route path="/Admin/addclass" element={<AddClass />} />
                        <Route path="/Admin/classes" element={<ShowClasses />} />
                        <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />

                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </ContentArea>

            </MainArea>
        </DashboardRoot>
    );
};

export default AdminDashboard;

/* ================= STYLES ================= */

const DashboardRoot = styled.div`
    display: flex;
    height: 100vh;
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
    justify-content: space-between;
    padding: 0 24px;
    align-items: center;
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
`;

const ContentArea = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 28px;
    animation: ${fadeIn} 0.3s ease;
`;