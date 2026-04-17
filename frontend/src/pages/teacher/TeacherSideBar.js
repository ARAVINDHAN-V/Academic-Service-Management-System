import * as React from 'react';
import {
    Divider, ListItemButton, ListItemIcon,
    ListItemText, ListSubheader, Box, Typography, Avatar, Tooltip,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import HomeRoundedIcon        from '@mui/icons-material/HomeRounded';
import ExitToAppIcon          from '@mui/icons-material/ExitToApp';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AnnouncementOutlinedIcon  from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon         from '@mui/icons-material/ClassOutlined';
import SchoolRoundedIcon         from '@mui/icons-material/SchoolRounded';

const TeacherSideBar = ({ collapsed }) => {
    const location = useLocation();
    const { currentUser } = useSelector(state => state.user);
    const sclassName = currentUser.teachSclass;

    const menuItems = [
        { label: 'Home',                        icon: <HomeRoundedIcon />,           path: '/Teacher/dashboard' },
        { label: `Class ${sclassName?.sclassName || ''}`, icon: <ClassOutlinedIcon />, path: '/Teacher/class' },
        { label: 'Complain',                    icon: <AnnouncementOutlinedIcon />,  path: '/Teacher/complain' },
    ];

    const userItems = [
        { label: 'Profile', icon: <AccountCircleOutlinedIcon />, path: '/Teacher/profile' },
        { label: 'Logout',  icon: <ExitToAppIcon />,             path: '/logout' },
    ];

    const renderItem = (item) => {
        const isActive = location.pathname === item.path ||
            (item.path !== '/Teacher/dashboard' && location.pathname.startsWith(item.path));

        const btn = (
            <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                    borderRadius: '10px',
                    mx: '8px', mb: '2px',
                    px: collapsed ? '10px' : '12px',
                    py: '9px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: isActive ? '#ecfeff' : 'transparent',
                    color: isActive ? '#0891b2' : '#64748b',
                    position: 'relative',
                    '&::before': isActive ? {
                        content: '""', position: 'absolute',
                        left: 0, top: '20%', height: '60%',
                        width: '3px', borderRadius: '0 4px 4px 0',
                        background: '#0891b2',
                    } : {},
                    '&:hover': {
                        background: isActive ? '#ecfeff' : '#f1f5f9',
                        color: isActive ? '#0891b2' : '#0f172a',
                    },
                    transition: 'all 0.15s ease',
                }}
            >
                <ListItemIcon sx={{
                    color: isActive ? '#0891b2' : '#94a3b8',
                    minWidth: 0, mr: collapsed ? 0 : '12px',
                    '& svg': { fontSize: 20 },
                }}>
                    {item.icon}
                </ListItemIcon>
                {!collapsed && (
                    <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.875rem',
                            color: 'inherit',
                        }}
                    />
                )}
            </ListItemButton>
        );

        return collapsed ? (
            <Tooltip title={item.label} placement="right" arrow key={item.label}>{btn}</Tooltip>
        ) : (
            <React.Fragment key={item.label}>{btn}</React.Fragment>
        );
    };

    return (
        <Box sx={{
            height: '100vh', width: collapsed ? '72px' : '240px',
            background: '#ffffff', borderRight: '1px solid #e2e8f0',
            display: 'flex', flexDirection: 'column',
            transition: 'width 0.25s ease', overflow: 'hidden', flexShrink: 0,
        }}>
            {/* Brand */}
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: '10px',
                px: collapsed ? '14px' : '20px', py: '18px',
                borderBottom: '1px solid #f1f5f9', minHeight: '64px', overflow: 'hidden',
            }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: '10px',
                    background: '#ecfeff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <SchoolRoundedIcon sx={{ fontSize: 20, color: '#0891b2' }} />
                </Box>
                {!collapsed && (
                    <Box>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                            ASMS
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>
                            Teacher Panel
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Nav */}
            <Box sx={{ flex: 1, py: '12px', px: 0, overflowY: 'auto', overflowX: 'hidden' }}>
                {!collapsed && (
                    <ListSubheader sx={{
                        fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        lineHeight: '32px', px: '20px', background: 'transparent',
                    }}>
                        Main Menu
                    </ListSubheader>
                )}
                {menuItems.map(renderItem)}

                <Divider sx={{ my: '12px', mx: '16px', borderColor: '#f1f5f9' }} />

                {!collapsed && (
                    <ListSubheader sx={{
                        fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        lineHeight: '32px', px: '20px', background: 'transparent',
                    }}>
                        Account
                    </ListSubheader>
                )}
                {userItems.map(renderItem)}
            </Box>

            {/* Profile footer */}
            {!collapsed && currentUser && (
                <Box sx={{
                    borderTop: '1px solid #f1f5f9', px: '16px', py: '14px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                    <Avatar sx={{
                        width: 34, height: 34,
                        background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                        fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                    }}>
                        {currentUser?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {currentUser?.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            Teacher
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default TeacherSideBar;