import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, TextField, Checkbox, FormControlLabel,
    IconButton, InputAdornment, CircularProgress, Divider,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    Visibility, VisibilityOff,
    AdminPanelSettingsRounded, SchoolRounded,
} from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../components/styles';
import { registerUser } from '../../redux/userRelated/userHandle';
import Popup from '../../components/Popup';

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-14px) rotate(1deg); }
    66%       { transform: translateY(-7px) rotate(-1deg); }
`;

// ─── Component ────────────────────────────────────────────────────────────────
const AdminRegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, currentUser, response, error, currentRole } = useSelector(s => s.user);

    const [toggle,          setToggle]          = useState(false);
    const [loader,          setLoader]          = useState(false);
    const [showPopup,       setShowPopup]       = useState(false);
    const [message,         setMessage]         = useState("");
    const [emailError,      setEmailError]      = useState(false);
    const [passwordError,   setPasswordError]   = useState(false);
    const [adminNameError,  setAdminNameError]  = useState(false);
    const [schoolNameError, setSchoolNameError] = useState(false);

    const role = "Admin";

    const handleSubmit = (e) => {
        e.preventDefault();
        const name       = e.target.adminName.value;
        const schoolName = e.target.schoolName.value;
        const email      = e.target.email.value;
        const password   = e.target.password.value;

        if (!name || !schoolName || !email || !password) {
            if (!name)       setAdminNameError(true);
            if (!schoolName) setSchoolNameError(true);
            if (!email)      setEmailError(true);
            if (!password)   setPasswordError(true);
            return;
        }
        setLoader(true);
        dispatch(registerUser({ name, email, password, role, schoolName }, role));
    };

    const handleInputChange = (e) => {
        const { name } = e.target;
        if (name === "email")      setEmailError(false);
        if (name === "password")   setPasswordError(false);
        if (name === "adminName")  setAdminNameError(false);
        if (name === "schoolName") setSchoolNameError(false);
    };

    useEffect(() => {
        if (status === "success" || (currentUser !== null && currentRole === "Admin")) {
            navigate("/Admin/dashboard");
        } else if (status === "failed") {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === "error") {
            console.log(error);
            setLoader(false);
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <ThemeProvider theme={theme}>
            <PageWrapper>
                {/* ── Left panel ── */}
                <LeftPanel>
                    <FloatingShapes>
                        {["#c7d2fe", "#a5b4fc", "#818cf8"].map((color, i) => (
                            <Shape key={i} color={color} delay={i * 0.7} size={70 + i * 45} top={15 + i * 24} left={8 + i * 22} />
                        ))}
                    </FloatingShapes>
                    <LeftContent>
                        <BrandMark>
                            <SchoolRounded sx={{ fontSize: 32, color: "rgba(255,255,255,0.95)" }} />
                        </BrandMark>
                        <LeftTitle>
                            Set up your school<br />in minutes
                        </LeftTitle>
                        <LeftSubtitle>
                            Create an admin account to manage students, teachers,
                            classes, and more — all in one place.
                        </LeftSubtitle>
                        <StepList>
                            {[
                                { step: "01", text: "Create your admin account" },
                                { step: "02", text: "Add teachers & students" },
                                { step: "03", text: "Manage classes & subjects" },
                            ].map(s => (
                                <StepItem key={s.step}>
                                    <StepNum>{s.step}</StepNum>
                                    <StepText>{s.text}</StepText>
                                </StepItem>
                            ))}
                        </StepList>
                    </LeftContent>
                </LeftPanel>

                {/* ── Right panel ── */}
                <RightPanel>
                    <FormCard>
                        <RoleChip>
                            <AdminPanelSettingsRounded sx={{ fontSize: 22, color: "#4f46e5" }} />
                            <span>Admin Registration</span>
                        </RoleChip>

                        <FormTitle>Create your account</FormTitle>
                        <FormSubtitle>Register your institution to get started</FormSubtitle>

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <TextField
                                margin="normal" required fullWidth
                                id="adminName" label="Your Full Name" name="adminName"
                                autoComplete="name" autoFocus
                                error={adminNameError}
                                helperText={adminNameError && "Name is required"}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal" required fullWidth
                                id="schoolName" label="School / Institution Name" name="schoolName"
                                autoComplete="off"
                                error={schoolNameError}
                                helperText={schoolNameError && "School name is required"}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal" required fullWidth
                                id="email" label="Email Address" name="email"
                                autoComplete="email"
                                error={emailError}
                                helperText={emailError && "Email is required"}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal" required fullWidth
                                name="password" label="Password"
                                type={toggle ? "text" : "password"}
                                id="password" autoComplete="new-password"
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

                            <FormControlLabel
                                sx={{ mt: 1 }}
                                control={<Checkbox size="small" />}
                                label={<span style={{ fontSize: 13, color: "#64748b" }}>I agree to the terms and conditions</span>}
                            />

                            <RegisterButton type="submit">
                                {loader
                                    ? <CircularProgress size={20} sx={{ color: "#fff" }} />
                                    : "Create Account"}
                            </RegisterButton>

                            <Divider sx={{ my: 2, color: "#94a3b8", fontSize: 13 }}>or</Divider>

                            <SigninRow>
                                Already have an account?{" "}
                                <SigninLink to="/Adminlogin">Sign in</SigninLink>
                            </SigninRow>
                        </Box>
                    </FormCard>
                </RightPanel>
            </PageWrapper>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
};

export default AdminRegisterPage;

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
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
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
    font-size: 2.2rem;
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
    line-height: 1.7;
`;

const StepList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

const StepItem = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const StepNum = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.78rem;
    font-weight: 800;
    color: #fff;
    flex-shrink: 0;
    backdrop-filter: blur(4px);
`;

const StepText = styled.span`
    font-size: 0.9rem;
    color: rgba(255,255,255,0.88);
    font-weight: 500;
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
    opacity: 0.15;
    top: ${p => p.top}%;
    left: ${p => p.left}%;
    animation: ${float} ${p => 4 + p.delay}s ease-in-out infinite;
    animation-delay: ${p => p.delay}s;
`;

const RightPanel = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    padding: 32px 16px;
    @media (min-width: 900px) {
        width: 500px;
        flex-shrink: 0;
    }
`;

const FormCard = styled.div`
    width: 100%;
    max-width: 420px;
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
    background: #eef2ff;
    color: #4f46e5;
    padding: 7px 16px 7px 10px;
    border-radius: 99px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 22px;
`;

const FormTitle = styled.h2`
    font-size: 1.65rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 6px;
    letter-spacing: -0.02em;
`;

const FormSubtitle = styled.p`
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 4px;
`;

const RegisterButton = styled.button`
    width: 100%;
    padding: 13px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
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
    box-shadow: 0 4px 16px rgba(79,70,229,0.28);
    transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
    &:hover {
        opacity: 0.92;
        transform: translateY(-1px);
        box-shadow: 0 6px 24px rgba(79,70,229,0.38);
    }
    &:active { transform: translateY(0); }
`;

const SigninRow = styled.p`
    text-align: center;
    font-size: 13.5px;
    color: #64748b;
    margin: 0;
`;

const SigninLink = styled(Link)`
    color: #4f46e5;
    font-weight: 700;
    margin-left: 4px;
    &:hover { text-decoration: underline; }
`;