import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import styled, { keyframes } from 'styled-components';
import {
    SchoolRounded,
    GroupsRounded,
    AssignmentTurnedInRounded,
    TrendingUpRounded,
    ArrowForwardRounded,
    CheckCircleRounded,
} from '@mui/icons-material';
import { theme } from '../components/styles';
import Students from "../assets/students.svg";

// ─── Animations ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ─── Features data ────────────────────────────────────────────────────────────
const features = [
    { icon: <GroupsRounded />,                label: "Student Management",    color: "#4f46e5", bg: "#eef2ff" },
    { icon: <AssignmentTurnedInRounded />,     label: "Attendance Tracking",  color: "#0891b2", bg: "#ecfeff" },
    { icon: <TrendingUpRounded />,             label: "Performance Analytics",color: "#059669", bg: "#ecfdf5" },
    { icon: <SchoolRounded />,                 label: "Academic Records",     color: "#d97706", bg: "#fffbeb" },
];

const highlights = [
    "Track student rankings & grades",
    "Organize classes and subjects",
    "Real-time attendance monitoring",
    "Seamless teacher-student communication",
];

// ─── Component ────────────────────────────────────────────────────────────────
const Homepage = () => {
    return (
        <ThemeProvider theme={theme}>
            <PageWrapper>
                {/* ── Top nav ── */}
                <TopNav>
                    <NavBrand>
                        <BrandIcon>
                            <SchoolRounded sx={{ fontSize: 22, color: "#4f46e5" }} />
                        </BrandIcon>
                        <BrandName>ASMS</BrandName>
                    </NavBrand>
                    <NavActions>
                        <NavLink to="/choose">Login</NavLink>
                        <NavCTA to="/Adminregister">Get Started</NavCTA>
                    </NavActions>
                </TopNav>

                {/* ── Hero section ── */}
                <HeroSection>
                    <HeroLeft>
                        <HeroBadge>
                            <span>🎓</span> Academic Service Management
                        </HeroBadge>
                        <HeroTitle>
                            Smart Tools for
                            <GradientWord> Modern Schools</GradientWord>
                        </HeroTitle>
                        <HeroText>
                            Manage student rankings, organize classes, track attendance,
                            assess performance, and communicate seamlessly — all in one platform.
                        </HeroText>

                        <HighlightList>
                            {highlights.map(h => (
                                <HighlightItem key={h}>
                                    <CheckCircleRounded sx={{ fontSize: 18, color: "#4f46e5" }} />
                                    {h}
                                </HighlightItem>
                            ))}
                        </HighlightList>

                        <CTARow>
                            <PrimaryButton to="/choose">
                                Get Started
                                <ArrowForwardRounded sx={{ fontSize: 18 }} />
                            </PrimaryButton>
                            
                        </CTARow>

                        <SignupNote>
                            New institution?{" "}
                            <Link to="/Adminregister" style={{ color: "#4f46e5", fontWeight: 700 }}>
                                Create your account →
                            </Link>
                        </SignupNote>
                    </HeroLeft>

                    <HeroRight>
                        <IllustrationCard>
                            <FloatImage src={Students} alt="Students" />
                            {/* Floating stat chips */}
                            <StatChip style={{ top: "12%", right: "-8%", background: "#fff", boxShadow: "0 4px 20px rgba(79,70,229,0.15)" }}>
                                <StatChipIcon style={{ background: "#eef2ff", color: "#4f46e5" }}>📈</StatChipIcon>
                                <div>
                                    <StatChipVal>98%</StatChipVal>
                                    <StatChipLabel>Attendance Rate</StatChipLabel>
                                </div>
                            </StatChip>
                            <StatChip style={{ bottom: "18%", left: "-10%", background: "#fff", boxShadow: "0 4px 20px rgba(5,150,105,0.15)" }}>
                                <StatChipIcon style={{ background: "#ecfdf5", color: "#059669" }}>🏫</StatChipIcon>
                                <div>
                                    <StatChipVal>1,200+</StatChipVal>
                                    <StatChipLabel>Students</StatChipLabel>
                                </div>
                            </StatChip>
                        </IllustrationCard>
                    </HeroRight>
                </HeroSection>

                {/* ── Features strip ── */}
                <FeaturesSection>
                    <FeaturesTitle>Everything you need</FeaturesTitle>
                    <FeaturesGrid>
                        {features.map(f => (
                            <FeatureCard key={f.label}>
                                <FeatureIconWrap style={{ background: f.bg, color: f.color }}>
                                    {f.icon}
                                </FeatureIconWrap>
                                <FeatureLabel>{f.label}</FeatureLabel>
                            </FeatureCard>
                        ))}
                    </FeaturesGrid>
                </FeaturesSection>

                {/* ── Footer ── */}
                <Footer>
                    <FooterText>
                        © 2025 Academic Service Management System. Built for modern education.
                    </FooterText>
                </Footer>
            </PageWrapper>
        </ThemeProvider>
    );
};

export default Homepage;

// ─── Styled Components ────────────────────────────────────────────────────────
const PageWrapper = styled.div`
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    flex-direction: column;
`;

/* Nav */
const TopNav = styled.nav`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 40px;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 100;
    animation: ${fadeUp} 0.4s ease both;
`;

const NavBrand = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const BrandIcon = styled.div`
    width: 38px;
    height: 38px;
    background: #eef2ff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const BrandName = styled.span`
    font-size: 1.1rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
`;

const NavActions = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const NavLink = styled(Link)`
    font-size: 0.9rem;
    font-weight: 600;
    color: #475569;
    transition: color 0.2s;
    &:hover { color: #4f46e5; }
`;

const NavCTA = styled(Link)`
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: #fff;
    font-size: 0.875rem;
    font-weight: 700;
    padding: 9px 20px;
    border-radius: 10px;
    transition: opacity 0.2s, transform 0.15s;
    box-shadow: 0 2px 12px rgba(79,70,229,0.25);
    &:hover { opacity: 0.9; transform: translateY(-1px); color: #fff; }
`;

/* Hero */
const HeroSection = styled.section`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    padding: 80px 40px 60px;
    max-width: 1180px;
    margin: 0 auto;
    width: 100%;
    flex: 1;
    @media (max-width: 900px) {
        flex-direction: column;
        padding: 48px 24px 40px;
    }
`;

const HeroLeft = styled.div`
    flex: 1;
    max-width: 560px;
    animation: ${fadeUp} 0.6s 0.1s ease both;
`;

const HeroBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #eef2ff;
    color: #4f46e5;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 99px;
    margin-bottom: 24px;
    letter-spacing: 0.01em;
`;

const HeroTitle = styled.h1`
    font-size: 3rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.15;
    letter-spacing: -0.03em;
    margin-bottom: 20px;
    @media (max-width: 600px) { font-size: 2rem; }
`;

const GradientWord = styled.span`
    background: linear-gradient(135deg, #4f46e5, #06b6d4, #059669);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${gradientShift} 4s ease infinite;
    display: block;
`;

const HeroText = styled.p`
    font-size: 1rem;
    color: #64748b;
    line-height: 1.75;
    margin-bottom: 28px;
    max-width: 480px;
`;

const HighlightList = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 36px;
`;

const HighlightItem = styled.li`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    color: #374151;
    font-weight: 500;
`;

const CTARow = styled.div`
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

const PrimaryButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: #fff;
    font-weight: 700;
    font-size: 0.95rem;
    padding: 14px 28px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(79,70,229,0.3);
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
        box-shadow: 0 8px 28px rgba(79,70,229,0.4);
        color: #fff;
    }
`;

const SecondaryButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    background: #fff;
    color: #475569;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 14px 28px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    &:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        transform: translateY(-1px);
        color: #0f172a;
    }
`;

const SignupNote = styled.p`
    font-size: 13.5px;
    color: #94a3b8;
`;

/* Hero right */
const HeroRight = styled.div`
    flex: 1;
    max-width: 500px;
    position: relative;
    animation: ${fadeUp} 0.6s 0.25s ease both;
    @media (max-width: 900px) { width: 100%; max-width: 400px; }
`;

const IllustrationCard = styled.div`
    position: relative;
    background: linear-gradient(145deg, #eef2ff 0%, #e0f2fe 100%);
    border-radius: 28px;
    padding: 40px;
    border: 1px solid #e0e7ff;
`;

const FloatImage = styled.img`
    width: 100%;
    animation: ${float} 5s ease-in-out infinite;
    display: block;
`;

const StatChip = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    border-radius: 14px;
    border: 1px solid #f1f5f9;
    backdrop-filter: blur(8px);
`;

const StatChipIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
`;

const StatChipVal = styled.div`
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1;
`;

const StatChipLabel = styled.div`
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
`;

/* Features */
const FeaturesSection = styled.section`
    background: #fff;
    border-top: 1px solid #e2e8f0;
    padding: 52px 40px;
`;

const FeaturesTitle = styled.h2`
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 32px;
    letter-spacing: -0.01em;
`;

const FeaturesGrid = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    max-width: 900px;
    margin: 0 auto;
`;

const FeatureCard = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 14px 22px;
    transition: box-shadow 0.2s, transform 0.2s;
    &:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.07);
        transform: translateY(-2px);
    }
`;

const FeatureIconWrap = styled.div`
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const FeatureLabel = styled.span`
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
`;

/* Footer */
const Footer = styled.footer`
    padding: 20px 40px;
    border-top: 1px solid #e2e8f0;
    background: #fff;
    text-align: center;
`;

const FooterText = styled.p`
    font-size: 13px;
    color: #94a3b8;
`;