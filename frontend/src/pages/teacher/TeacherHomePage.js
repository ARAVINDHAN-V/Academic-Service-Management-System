import { useEffect } from 'react';
import { Grid, Divider } from '@mui/material';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import {
    PeopleAltRounded,
    MenuBookRounded,
    AssignmentTurnedInRounded,
    AccessTimeRounded,
    ArrowUpwardRounded,
} from '@mui/icons-material';
import SeeNotice from '../../components/SeeNotice';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const statConfig = [
    {
        key: 'students',
        label: 'Class Students',
        icon: <PeopleAltRounded />,
        color: '#0891b2',
        bg: '#ecfeff',
        trend: 'Enrolled this term',
    },
    {
        key: 'lessons',
        label: 'Total Lessons',
        icon: <MenuBookRounded />,
        color: '#4f46e5',
        bg: '#eef2ff',
        trend: 'Planned sessions',
    },
    {
        key: 'tests',
        label: 'Tests Taken',
        icon: <AssignmentTurnedInRounded />,
        color: '#059669',
        bg: '#ecfdf5',
        trend: 'This semester',
    },
    {
        key: 'hours',
        label: 'Total Hours',
        icon: <AccessTimeRounded />,
        color: '#d97706',
        bg: '#fffbeb',
        trend: 'Teaching hours',
        suffix: 'hrs',
    },
];

const TeacherHomePage = () => {
    const dispatch = useDispatch();
    const { currentUser }                    = useSelector(s => s.user);
    const { subjectDetails, sclassStudents } = useSelector(s => s.sclass);

    const classID   = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, 'Subject'));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    const counts = {
        students: sclassStudents?.length ?? 0,
        lessons:  subjectDetails?.sessions ?? 0,
        tests:    0,
        hours:    1,
    };

    return (
        <PageWrapper>
            {/* Header */}
            <Header>
                <div>
                    <PageTitle>
                        Welcome back, {currentUser?.name?.split(' ')[0]} 👋
                    </PageTitle>
                    <PageSub>
                        {currentUser.teachSclass?.sclassName
                            ? `Teaching ${currentUser.teachSubject?.subName || 'your subject'} · Class ${currentUser.teachSclass.sclassName}`
                            : 'Your teaching overview for today'}
                    </PageSub>
                </div>
            </Header>

            {/* Stat cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {statConfig.map((cfg, i) => (
                    <Grid item xs={12} sm={6} lg={3} key={cfg.key}>
                        <StatCard style={{ animationDelay: `${i * 0.07}s` }}>
                            <CardTop>
                                <CardIcon style={{ background: cfg.bg, color: cfg.color }}>
                                    {cfg.icon}
                                </CardIcon>
                                <TrendPill>
                                    <ArrowUpwardRounded sx={{ fontSize: 11 }} />
                                </TrendPill>
                            </CardTop>
                            <CardValue style={{ color: cfg.color }}>
                                <CountUp
                                    start={0}
                                    end={counts[cfg.key]}
                                    duration={2}
                                    suffix={cfg.suffix || ''}
                                />
                            </CardValue>
                            <CardLabel>{cfg.label}</CardLabel>
                            <CardTrend>{cfg.trend}</CardTrend>
                        </StatCard>
                    </Grid>
                ))}
            </Grid>

            {/* Quick info bar */}
            <InfoBar>
                <InfoItem>
                    <InfoDot style={{ background: '#0891b2' }} />
                    <span>Subject: <strong>{currentUser.teachSubject?.subName || '—'}</strong></span>
                </InfoItem>
                <InfoDivider />
                <InfoItem>
                    <InfoDot style={{ background: '#4f46e5' }} />
                    <span>Class: <strong>{currentUser.teachSclass?.sclassName || '—'}</strong></span>
                </InfoItem>
                <InfoDivider />
                <InfoItem>
                    <InfoDot style={{ background: '#059669' }} />
                    <span><strong>{counts.students}</strong> students in your class</span>
                </InfoItem>
            </InfoBar>

            {/* Notices */}
            <NoticeSection>
                <SectionHeader>
                    <SectionTitle>Recent Notices</SectionTitle>
                    <SectionSub>Latest announcements from administration</SectionSub>
                </SectionHeader>
                <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />
                <SeeNotice />
            </NoticeSection>
        </PageWrapper>
    );
};

export default TeacherHomePage;

// ─── Styled Components ────────────────────────────────────────────────────────
const PageWrapper = styled.div`
    font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Header = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 28px;
`;

const PageTitle = styled.h2`
    font-size: 1.4rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px;
    letter-spacing: -0.02em;
`;

const PageSub = styled.p`
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
`;

const StatCard = styled.div`
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px 22px;
    animation: ${fadeUp} 0.45s ease both;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    &:hover {
        box-shadow: 0 6px 24px rgba(0,0,0,0.08);
        transform: translateY(-2px);
    }
`;

const CardTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
`;

const CardIcon = styled.div`
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    & svg { font-size: 22px; }
`;

const TrendPill = styled.div`
    width: 26px; height: 26px;
    border-radius: 99px;
    background: #ecfdf5; color: #059669;
    display: flex; align-items: center; justify-content: center;
`;

const CardValue = styled.div`
    font-size: 2rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 4px;
    letter-spacing: -0.03em;
`;

const CardLabel = styled.p`
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
    margin: 0 0 6px;
`;

const CardTrend = styled.p`
    font-size: 0.75rem;
    color: #94a3b8;
    margin: 0;
`;

const InfoBar = styled.div`
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 28px;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    color: #475569;
`;

const InfoDot = styled.span`
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
`;

const InfoDivider = styled.div`
    width: 1px; height: 18px;
    background: #e2e8f0;
    margin: 0 8px;
`;

const NoticeSection = styled.div`
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px 26px;
`;

const SectionHeader = styled.div`
    margin-bottom: 14px;
`;

const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px;
`;

const SectionSub = styled.p`
    font-size: 0.8125rem;
    color: #94a3b8;
    margin: 0;
`;