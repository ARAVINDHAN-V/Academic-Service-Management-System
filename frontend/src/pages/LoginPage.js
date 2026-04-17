import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Typography, TextField, Checkbox, FormControlLabel,
    IconButton, InputAdornment, CircularProgress, Backdrop,
    Divider,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff, SchoolRounded, AdminPanelSettingsRounded, PersonRounded } from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { theme } from '../components/styles';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

// ─── Animations ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-12px) rotate(1deg); }
  66%       { transform: translateY(-6px) rotate(-1deg); }
`;

// ─── Role config ─────────────────────────────────────────────────────────────
const roleConfig = {
    Admin: {
        icon: <AdminPanelSettingsRounded sx={{ fontSize: 28 }} />,
        color: "#4f46e5",
        gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        bg: "#eef2ff",
        tagline: "Manage your institution with ease",
        shapes: ["#c7d2fe", "#a5b4fc", "#818cf8"],
    },
    Teacher: {
        icon: <PersonRounded sx={{ fontSize: 28 }} />,
        color: "#0891b2",
        gradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
        bg: "#ecfeff",
        tagline: "Inspire students every single day",
        shapes: ["#a5f3fc", "#67e8f9", "#22d3ee"],
    },
    Student: {
        icon: <SchoolRounded sx={{ fontSize: 28 }} />,
        color: "#059669",
        gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
        bg: "#ecfdf5",
        tagline: "Learn, grow, and achieve your goals",
        shapes: ["#a7f3d0", "#6ee7b7", "#34d399"],
    },
};

// ─── Component ───────────────────────────────────────────────────────────────
const LoginPage = ({ role }) => {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const { status, currentUser, response, error, currentRole } = useSelector(s => s.user);

    const [toggle,       setToggle]       = useState(false);
    const [guestLoader,  setGuestLoader]  = useState(false);
    const [loader,       setLoader]       = useState(false);
    const [showPopup,    setShowPopup]    = useState(false);
    const [message,      setMessage]      = useState("");

    const [emailError,       setEmailError]       = useState(false);
    const [passwordError,    setPasswordError]    = useState(false);
    const [rollNumberError,  setRollNumberError]  = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);

    const cfg = roleConfig[role] || roleConfig.Admin;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (role === "Student") {
            const rollNum     = e.target.rollNumber.value;
            const studentName = e.target.studentName.value;
            const password    = e.target.password.value;
            if (!rollNum || !studentName || !password) {
                if (!rollNum)     setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!password)    setPasswordError(true);
                return;
            }
            setLoader(true);
            dispatch(loginUser({ rollNum, studentName, password }, role));
        } else {
            const email    = e.target.email.value;
            const password = e.target.password.value;
            if (!email || !password) {
                if (!email)    setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }
            setLoader(true);
            dispatch(loginUser({ email, password }, role));
        }
    };

    const handleInputChange = (e) => {
        const { name } = e.target;
        if (name === "email")       setEmailError(false);
        if (name === "password")    setPasswordError(false);
        if (name === "rollNumber")  setRollNumberError(false);
        if (name === "studentName") setStudentNameError(false);
    };

    const guestModeHandler = () => {
        const password = "zxc";
        setGuestLoader(true);
        if (role === "Admin") {
            dispatch(loginUser({ email: "yogendra@12", password }, role));
        } else if (role === "Student") {
            dispatch(loginUser({ rollNum: "1", studentName: "Dipesh Awasthi", password }, role));
        } else if (role === "Teacher") {
            dispatch(loginUser({ email: "tony@12", password }, role));
        }
    };

    useEffect(() => {
        if (status === "success" || currentUser !== null) {
            if (currentRole === "Admin")   navigate("/Admin/dashboard");
            else if (currentRole === "Student") navigate("/Student/dashboard");
            else if (currentRole === "Teacher") navigate("/Teacher/dashboard");
        } else if (status === "failed") {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === "error") {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
            setGuestLoader(false);
        }
    }, [status, currentRole, navigate, error, response, currentUser]);

    return (
        <ThemeProvider theme={theme}>
            <PageWrapper>
                {/* ── Left panel: illustration ── */}
                <LeftPanel style={{ background: cfg.gradient }}>
                    <FloatingShapes>
                        {cfg.shapes.map((color, i) => (
                            <Shape key={i} color={color} delay={i * 0.6} size={80 + i * 40} top={20 + i * 22} left={10 + i * 20} />
                        ))}
                    </FloatingShapes>
                    <LeftContent>
                        <BrandMark>
                            <SchoolRounded sx={{ fontSize: 36, color: "rgba(255,255,255,0.95)" }} />
                        </BrandMark>
                        <LeftTitle>Academic Service<br />Management System</LeftTitle>
                        <LeftSubtitle>{cfg.tagline}</LeftSubtitle>
                        <FeatureList>
                            {["Track attendance & marks", "Manage classes & subjects", "Seamless communication"].map(f => (
                                <FeatureItem key={f}>
                                    <FeatureDot />
                                    {f}
                                </FeatureItem>
                            ))}
                        </FeatureList>
                    </LeftContent>
                    <BottomWave viewBox="0 0 1440 80" preserveAspectRatio="none">
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="rgba(255,255,255,0.08)" />
                    </BottomWave>
                </LeftPanel>

                {/* ── Right panel: form ── */}
                <RightPanel>
                    <FormCard>
                        <RoleChip style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.icon}
                            <span>{role} Portal</span>
                        </RoleChip>

                        <FormTitle>Welcome back</FormTitle>
                        <FormSubtitle>Enter your credentials to continue</FormSubtitle>

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            {role === "Student" ? (
                                <>
                                    <TextField
                                        margin="normal" required fullWidth
                                        id="rollNumber" label="Roll Number" name="rollNumber"
                                        autoComplete="off" type="number" autoFocus
                                        error={rollNumberError}
                                        helperText={rollNumberError && "Roll Number is required"}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        margin="normal" required fullWidth
                                        id="studentName" label="Your Full Name" name="studentName"
                                        autoComplete="name"
                                        error={studentNameError}
                                        helperText={studentNameError && "Name is required"}
                                        onChange={handleInputChange}
                                    />
                                </>
                            ) : (
                                <TextField
                                    margin="normal" required fullWidth
                                    id="email" label="Email address" name="email"
                                    autoComplete="email" autoFocus
                                    error={emailError}
                                    helperText={emailError && "Email is required"}
                                    onChange={handleInputChange}
                                />
                            )}

                            <TextField
                                margin="normal" required fullWidth
                                name="password" label="Password"
                                type={toggle ? "text" : "password"}
                                id="password" autoComplete="current-password"
                                error={passwordError}
                                helperText={passwordError && "Password is required"}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)} edge="end" size="small">
                                                {toggle ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <RememberRow>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label={<span style={{ fontSize: 14 }}>Remember me</span>}
                                />
                                <ForgotLink href="#">Forgot password?</ForgotLink>
                            </RememberRow>

                            <LoginButton type="submit" style={{ background: cfg.gradient }}>
                                {loader
                                    ? <CircularProgress size={20} sx={{ color: "#fff" }} />
                                    : `Sign in as ${role}`}
                            </LoginButton>

                            <Divider sx={{ my: 2, color: "#94a3b8", fontSize: 13 }}>or</Divider>

                            <GuestButton type="button" onClick={guestModeHandler} style={{ borderColor: cfg.color, color: cfg.color }}>
                                {guestLoader
                                    ? <CircularProgress size={18} sx={{ color: cfg.color }} />
                                    : "Continue as Guest"}
                            </GuestButton>

                            {role === "Admin" && (
                                <SignupRow>
                                    Don&apos;t have an account?{" "}
                                    <SignupLink to="/Adminregister" style={{ color: cfg.color }}>
                                        Create account
                                    </SignupLink>
                                </SignupRow>
                            )}
                        </Box>
                    </FormCard>
                </RightPanel>
            </PageWrapper>

            <Backdrop sx={{ color: "#fff", zIndex: t => t.zIndex.drawer + 1, backdropFilter: "blur(4px)" }} open={guestLoader}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <CircularProgress color="inherit" />
                    <Typography variant="body2" sx={{ color: "#fff" }}>Setting up guest session…</Typography>
                </Box>
            </Backdrop>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
};


// ─── Styled Components ────────────────────────────────────────────────────────
const PageWrapper = styled.div`
    display: flex;
    min-height: 100vh;
    font-family: 'Plus Jakarta Sans', sans-serif;
`;

const LeftPanel = styled.div`
    display: none;
    flex: 1;
    position: relative;
    overflow: hidden;
    @media (min-width: 900px) { display: flex; flex-direction: column; }
`;

const LeftContent = styled.div`
    position: relative;
    z-index: 2;
    padding: 60px 52px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
`;

const BrandMark = styled.div`
    width: 60px;
    height: 60px;
    background: rgba(255,255,255,0.18);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
    backdrop-filter: blur(4px);
`;

const LeftTitle = styled.h1`
    font-size: 2.1rem;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.25;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
`;

const LeftSubtitle = styled.p`
    font-size: 1rem;
    color: rgba(255,255,255,0.8);
    margin-bottom: 40px;
    line-height: 1.6;
`;

const FeatureList = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const FeatureItem = styled.li`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.95rem;
    color: rgba(255,255,255,0.88);
    font-weight: 500;
`;

const FeatureDot = styled.span`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.7);
    flex-shrink: 0;
`;

const FloatingShapes = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
`;

const Shape = styled.div`
    position: absolute;
    width: ${p => p.size}px;
    height: ${p => p.size}px;
    border-radius: 50%;
    background: ${p => p.color};
    opacity: 0.18;
    top: ${p => p.top}%;
    left: ${p => p.left}%;
    animation: ${float} ${p => 4 + p.delay}s ease-in-out infinite;
    animation-delay: ${p => p.delay}s;
`;

const BottomWave = styled.svg`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
`;

const RightPanel = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    padding: 32px 16px;
    @media (min-width: 900px) {
        width: 460px;
        flex-shrink: 0;
    }
`;

const FormCard = styled.div`
    width: 100%;
    max-width: 400px;
    background: #ffffff;
    border-radius: 24px;
    border: 1px solid #e2e8f0;
    padding: 40px 36px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.06);
    animation: ${fadeUp} 0.5s ease both;
`;

const RoleChip = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 16px 7px 10px;
    border-radius: 99px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 24px;
    span { line-height: 1; }
`;

const FormTitle = styled.h2`
    font-size: 1.75rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 6px;
    letter-spacing: -0.02em;
`;

const FormSubtitle = styled.p`
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 4px;
`;

const RememberRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 4px 0 8px;
`;

const ForgotLink = styled.a`
    font-size: 13px;
    font-weight: 600;
    color: #4f46e5;
    cursor: pointer;
    &:hover { text-decoration: underline; }
`;

const LoginButton = styled.button`
    width: 100%;
    padding: 13px;
    border: none;
    border-radius: 12px;
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
    transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 16px rgba(79,70,229,0.25);
    &:hover {
        opacity: 0.92;
        transform: translateY(-1px);
        box-shadow: 0 6px 24px rgba(79,70,229,0.35);
    }
    &:active { transform: translateY(0); }
`;

const GuestButton = styled.button`
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    background: transparent;
    border: 1.5px solid;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s ease, transform 0.15s ease;
    &:hover {
        background: rgba(79,70,229,0.04);
        transform: translateY(-1px);
    }
    &:active { transform: translateY(0); }
`;

const SignupRow = styled.p`
    text-align: center;
    font-size: 13.5px;
    color: #64748b;
    margin-top: 20px;
`;

const SignupLink = styled(Link)`
    font-weight: 700;
    margin-left: 4px;
    &:hover { text-decoration: underline; }
`;

export default LoginPage;
