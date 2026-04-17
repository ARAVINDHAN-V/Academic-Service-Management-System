import { useEffect } from 'react';
import { Paper, Typography, Box, Grid, Divider } from '@mui/material';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import {
    PeopleAltRounded,
    ClassRounded,
    SupervisorAccountRounded,
    AccountBalanceWalletRounded,
    TrendingUpRounded,
    ArrowUpwardRounded,
} from '@mui/icons-material';
import SeeNotice from '../../components/SeeNotice';
import { getAllSclasses }  from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents }  from '../../redux/studentRelated/studentHandle';
import { getAllTeachers }  from '../../redux/teacherRelated/teacherHandle';

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
`;

// ─── Stat card config ─────────────────────────────────────────────────────────
const statConfig = [
    {
        key: "students",
        label: "Total Students",
        icon: <PeopleAltRounded />,
        color: "#4f46e5",
        bg: "#eef2ff",
        trend: "+12% this month",
    },
    {
        key: "classes",
        label: "Total Classes",
        icon: <ClassRounded />,
        color: "#0891b2",
        bg: "#ecfeff",
        trend: "+2 new classes",
    },
    {
        key: "teachers",
        label: "Total Teachers",
        icon: <SupervisorAccountRounded />,
        color: "#059669",
        bg: "#ecfdf5",
        trend: "+3 this semester",
    },
    {
        key: "fees",
        label: "Fees Collected",
        icon: <AccountBalanceWalletRounded />,
        color: "#d97706",
        bg: "#fffbeb",
        trend: "₹0 pending",
        prefix: "₹",
    },
];

// ─── Component ────────────────────────────────────────────────────────────────
const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector(s => s.student);
    const { sclassesList } = useSelector(s => s.sclass);
    const { teachersList } = useSelector(s => s.teacher);
    const { currentUser }  = useSelector(s => s.user);

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const counts = {
        students: studentsList?.length ?? 0,
        classes:  sclassesList?.length ?? 0,
        teachers: teachersList?.length ?? 0,
        fees:     0,
    };

    return (
        <PageWrapper>
            {/* ── Page header ── */}
            <Header>
                <Box>
                    <PageTitle>Welcome back, {currentUser?.name?.split(" ")[0]} 👋</PageTitle>
                    <PageSub>Here's what's happening in your school today.</PageSub>
                </Box>
                <TrendBadge>
                    <TrendingUpRounded sx={{ fontSize: 16 }} />
                    School overview
                </TrendBadge>
            </Header>

            {/* ── Stat cards ── */}
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
                                    prefix={cfg.prefix || ""}
                                />
                            </CardValue>
                            <CardLabel>{cfg.label}</CardLabel>
                            <CardTrend>{cfg.trend}</CardTrend>
                        </StatCard>
                    </Grid>
                ))}
            </Grid>

            {/* ── Quick summary bar ── */}
            <SummaryBar>
                <SummaryItem>
                    <SummaryDot style={{ background: "#4f46e5" }} />
                    <span><strong>{counts.students}</strong> students enrolled</span>
                </SummaryItem>
                <SummaryDivider />
                <SummaryItem>
                    <SummaryDot style={{ background: "#0891b2" }} />
                    <span><strong>{counts.classes}</strong> active classes</span>
                </SummaryItem>
                <SummaryDivider />
                <SummaryItem>
                    <SummaryDot style={{ background: "#059669" }} />
                    <span><strong>{counts.teachers}</strong> faculty members</span>
                </SummaryItem>
            </SummaryBar>

            {/* ── Notices section ── */}
            <NoticeSection>
                <SectionHeader>
                    <SectionTitle>Recent Notices</SectionTitle>
                    <SectionSub>Latest announcements for your school</SectionSub>
                </SectionHeader>
                <Divider sx={{ mb: 2, borderColor: "#f1f5f9" }} />
                <SeeNotice />
            </NoticeSection>
        </PageWrapper>
    );
};

export default AdminHomePage;

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

const TrendBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ecfdf5;
    color: #059669;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 7px 14px;
    border-radius: 99px;
    border: 1px solid #d1fae5;
`;

/* Stat card */
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
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    & svg { font-size: 22px; }
`;

const TrendPill = styled.div`
    width: 26px;
    height: 26px;
    border-radius: 99px;
    background: #ecfdf5;
    color: #059669;
    display: flex;
    align-items: center;
    justify-content: center;
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

/* Summary bar */
const SummaryBar = styled.div`
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

const SummaryItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    color: #475569;
`;

const SummaryDot = styled.span`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
`;

const SummaryDivider = styled.div`
    width: 1px;
    height: 18px;
    background: #e2e8f0;
    margin: 0 8px;
`;

/* Notice section */
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