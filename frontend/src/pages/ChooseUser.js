import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Backdrop, Typography } from '@mui/material';
import {
    AdminPanelSettingsRounded,
    SchoolRounded,
    PersonRounded,
    ArrowForwardRounded,
} from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
`;

const gradientShift = keyframes`
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

// ─── Role config ──────────────────────────────────────────────────────────────
const roles = [
    {
        key: 'Admin',
        icon: <AdminPanelSettingsRounded sx={{ fontSize: 36 }} />,
        title: 'Admin',
        desc: 'Manage students, teachers, classes, notices and the entire institution from one place.',
        color: '#4f46e5',
        lightBg: '#eef2ff',
        borderColor: '#c7d2fe',
        gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        delay: '0s',
        tag: 'Full Access',
    },
    {
        key: 'Teacher',
        icon: <PersonRounded sx={{ fontSize: 36 }} />,
        title: 'Teacher',
        desc: 'Access your class, track attendance, record marks and communicate with students.',
        color: '#0891b2',
        lightBg: '#ecfeff',
        borderColor: '#a5f3fc',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
        delay: '0.1s',
        tag: 'Class Management',
    },
    {
        key: 'Student',
        icon: <SchoolRounded sx={{ fontSize: 36 }} />,
        title: 'Student',
        desc: 'View your subjects, attendance records, exam marks and school notices easily.',
        color: '#059669',
        lightBg: '#ecfdf5',
        borderColor: '#a7f3d0',
        gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        delay: '0.2s',
        tag: 'Student Portal',
    },
];

// ─── Component ────────────────────────────────────────────────────────────────
const ChooseUser = ({ visitor }) => {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const password  = 'zxc';

    const { status, currentUser, currentRole } = useSelector(s => s.user);

    const [loader,    setLoader]    = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message,   setMessage]   = useState('');
    const [hovered,   setHovered]   = useState(null);

    const navigateHandler = (user) => {
        if (user === 'Admin') {
            if (visitor === 'guest') {
                setLoader(true);
                dispatch(loginUser({ email: 'aravindhan@04', password }, user));
            } else navigate('/Adminlogin');
        } else if (user === 'Student') {
            if (visitor === 'guest') {
                setLoader(true);
                dispatch(loginUser({ rollNum: '1', studentName: 'RohitSharma', password }, user));
            } else navigate('/Studentlogin');
        } else if (user === 'Teacher') {
            if (visitor === 'guest') {
                setLoader(true);
                dispatch(loginUser({ email: 'sachin@10', password }, user));
            } else navigate('/Teacherlogin');
        }
    };

    useEffect(() => {
        if (status === 'success' || currentUser !== null) {
            if (currentRole === 'Admin')        navigate('/Admin/dashboard');
            else if (currentRole === 'Student') navigate('/Student/dashboard');
            else if (currentRole === 'Teacher') navigate('/Teacher/dashboard');
        } else if (status === 'error') {
            setLoader(false);
            setMessage('Network Error');
            setShowPopup(true);
        }
    }, [status, currentRole, navigate, currentUser]);

    return (
        <PageWrapper>
            {/* Background blobs */}
            <Blob style={{ top: '-120px', left: '-120px', background: 'rgba(79,70,229,0.08)', width: 400, height: 400 }} />
            <Blob style={{ bottom: '-100px', right: '-80px', background: 'rgba(8,145,178,0.08)', width: 350, height: 350 }} />
            <Blob style={{ top: '40%', left: '50%', background: 'rgba(5,150,105,0.06)', width: 300, height: 300 }} />

            <ContentWrapper>
                {/* Header */}
                <PageHeader>
                    <LogoMark>
                        <SchoolRounded sx={{ fontSize: 28, color: '#4f46e5' }} />
                    </LogoMark>
                    <HeaderBadge>
                        {visitor === 'guest' ? '👋 Guest Mode' : '🎓 ASMS'}
                    </HeaderBadge>
                    <PageTitle>
                        {visitor === 'guest' ? 'Exploring as a guest?' : 'Who are you?'}
                    </PageTitle>
                    <PageSubtitle>
                        {visitor === 'guest'
                            ? 'Choose a role to preview the platform with sample data'
                            : 'Select your role to sign in to the right portal'}
                    </PageSubtitle>
                </PageHeader>

                {/* Role cards */}
                <CardsGrid>
                    {roles.map((role) => (
                        <RoleCard
                            key={role.key}
                            onClick={() => navigateHandler(role.key)}
                            onMouseEnter={() => setHovered(role.key)}
                            onMouseLeave={() => setHovered(null)}
                            $active={hovered === role.key}
                            $color={role.color}
                            $border={role.borderColor}
                            style={{ animationDelay: role.delay }}
                        >
                            {/* Top accent bar */}
                            <AccentBar style={{ background: role.gradient }} />

                            {/* Tag */}
                            <RoleTag style={{ background: role.lightBg, color: role.color }}>
                                {role.tag}
                            </RoleTag>

                            {/* Icon */}
                            <IconWrap
                                style={{
                                    background: hovered === role.key ? role.gradient : role.lightBg,
                                    color: hovered === role.key ? '#fff' : role.color,
                                    boxShadow: hovered === role.key
                                        ? `0 8px 24px ${role.color}40`
                                        : 'none',
                                }}
                            >
                                {role.icon}
                            </IconWrap>

                            <RoleTitle style={{ color: hovered === role.key ? role.color : '#0f172a' }}>
                                {role.title}
                            </RoleTitle>

                            <RoleDesc>{role.desc}</RoleDesc>

                            {/* CTA */}
                            <RoleCTA style={{
                                background: hovered === role.key ? role.gradient : 'transparent',
                                color: hovered === role.key ? '#fff' : role.color,
                                borderColor: hovered === role.key ? 'transparent' : role.borderColor,
                                boxShadow: hovered === role.key ? `0 4px 16px ${role.color}35` : 'none',
                            }}>
                                {visitor === 'guest' ? 'Continue as Guest' : `Sign in as ${role.title}`}
                                <ArrowForwardRounded sx={{ fontSize: 16 }} />
                            </RoleCTA>
                        </RoleCard>
                    ))}
                </CardsGrid>

                {/* Bottom note */}
                <BottomNote>
                    {visitor === 'guest'
                        ? 'Guest accounts use sample data. No real data will be affected.'
                        : <>Don't have an account?{' '}<NavLink onClick={() => navigate('/Adminregister')}>Register your school →</NavLink></>
                    }
                </BottomNote>
            </ContentWrapper>

            <Backdrop
                sx={{ color: '#fff', zIndex: t => t.zIndex.drawer + 1, backdropFilter: 'blur(4px)' }}
                open={loader}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <CircularProgress color="inherit" />
                    <Typography variant="body2" sx={{ color: '#fff', fontFamily: 'Plus Jakarta Sans' }}>
                        Setting up your session…
                    </Typography>
                </div>
            </Backdrop>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </PageWrapper>
    );
};

export default ChooseUser;

// ─── Styled Components ────────────────────────────────────────────────────────
const PageWrapper = styled.div`
    min-height: 100vh;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 40px 20px;
`;

const Blob = styled.div`
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
    z-index: 0;
`;

const ContentWrapper = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PageHeader = styled.div`
    text-align: center;
    margin-bottom: 48px;
    animation: ${fadeUp} 0.5s ease both;
`;

const LogoMark = styled.div`
    width: 56px;
    height: 56px;
    background: #eef2ff;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    border: 1px solid #e0e7ff;
`;

const HeaderBadge = styled.div`
    display: inline-block;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 99px;
    padding: 6px 16px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
`;

const PageTitle = styled.h1`
    font-size: 2.4rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.03em;
    margin: 0 0 12px;
    @media (max-width: 600px) { font-size: 1.8rem; }
`;

const PageSubtitle = styled.p`
    font-size: 1rem;
    color: #64748b;
    margin: 0;
    max-width: 440px;
    margin: 0 auto;
    line-height: 1.65;
`;

const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    width: 100%;

    @media (max-width: 860px) {
        grid-template-columns: 1fr;
        max-width: 420px;
    }
`;

const RoleCard = styled.div`
    background: #ffffff;
    border: 1.5px solid ${p => p.$active ? p.$border : '#e2e8f0'};
    border-radius: 20px;
    padding: 28px 24px 24px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative;
    overflow: hidden;
    animation: ${fadeUp} 0.5s ease both;
    transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    transform: ${p => p.$active ? 'translateY(-6px)' : 'translateY(0)'};
    box-shadow: ${p => p.$active
        ? `0 12px 40px ${p.$color}20`
        : '0 1px 4px rgba(0,0,0,0.05)'};
`;

const AccentBar = styled.div`
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    border-radius: 20px 20px 0 0;
`;

const RoleTag = styled.div`
    display: inline-flex;
    align-self: flex-start;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 4px 11px;
    border-radius: 99px;
    letter-spacing: 0.02em;
`;

const IconWrap = styled.div`
    width: 68px;
    height: 68px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
    animation: ${float} 4s ease-in-out infinite;
`;

const RoleTitle = styled.h3`
    font-size: 1.3rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.02em;
    transition: color 0.2s ease;
`;

const RoleDesc = styled.p`
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
    line-height: 1.65;
    flex: 1;
`;

const RoleCTA = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 20px;
    border-radius: 10px;
    border: 1.5px solid;
    font-size: 0.875rem;
    font-weight: 700;
    margin-top: 4px;
    transition: all 0.25s ease;
`;

const BottomNote = styled.p`
    margin-top: 36px;
    font-size: 0.875rem;
    color: #94a3b8;
    text-align: center;
    animation: ${fadeUp} 0.5s 0.3s ease both;
`;

const NavLink = styled.span`
    color: #4f46e5;
    font-weight: 700;
    cursor: pointer;
    &:hover { text-decoration: underline; }
`;