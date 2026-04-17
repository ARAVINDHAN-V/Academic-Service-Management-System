import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import {
    CircularProgress, Box, Typography, TextField,
    IconButton, Tooltip, Chip,
} from '@mui/material';
import {
    AutoAwesomeRounded,
    AddCircleOutlineRounded,
    TitleRounded,
    NotesRounded,
    CalendarTodayRounded,
    AnnouncementRounded,
} from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import Popup from '../../../components/Popup';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
`;

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

const AddNotice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, response, error } = useSelector(state => state.user);
    const { currentUser }             = useSelector(state => state.user);

    const [title,     setTitle]     = useState('');
    const [details,   setDetails]   = useState('');
    const [date,      setDate]      = useState('');
    const [loader,    setLoader]    = useState(false);
    const [aiLoader,  setAiLoader]  = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message,   setMessage]   = useState('');
    const [aiUsed,    setAiUsed]    = useState(false);

    const adminID = currentUser._id;
    const address = 'Notice';

    const submitHandler = (e) => {
        e.preventDefault();
        setLoader(true);
        dispatch(addStuff({ title, details, date, adminID }, address));
    };

    const generateNotice = async () => {
        if (!title.trim()) {
            setMessage('Please enter a title first so AI knows what to write about.');
            setShowPopup(true);
            return;
        }
        try {
            setAiLoader(true);
            const res = await axios.post('http://localhost:5000/generate-notice', { topic: title });
            setDetails(res.data.notice);
            setAiUsed(true);
        } catch (err) {
            console.log(err);
            setMessage('AI generation failed. Please try again.');
            setShowPopup(true);
        } finally {
            setAiLoader(false);
        }
    };

    useEffect(() => {
        if (status === 'added') {
            navigate('/Admin/notices');
            dispatch(underControl());
        } else if (status === 'error') {
            setMessage('Network Error');
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    const wordCount = details.trim() ? details.trim().split(/\s+/).length : 0;

    return (
        <PageWrapper>
            <FormCard>
                {/* ── Header ── */}
                <CardHeader>
                    <HeaderIcon>
                        <AnnouncementRounded sx={{ fontSize: 26, color: '#4f46e5' }} />
                    </HeaderIcon>
                    <HeaderText>
                        <CardTitle>Add Notice</CardTitle>
                        <CardSubtitle>Create a new announcement for your school</CardSubtitle>
                    </HeaderText>
                    <AiBadge>
                        <AutoAwesomeRounded sx={{ fontSize: 13 }} />
                        AI Powered
                    </AiBadge>
                </CardHeader>

                <Divider />

                {/* ── Form ── */}
                <FormBody onSubmit={submitHandler}>

                    {/* Title field */}
                    <FieldGroup>
                        <FieldLabel>
                            <TitleRounded sx={{ fontSize: 16, color: '#4f46e5' }} />
                            Notice Title <Required>*</Required>
                        </FieldLabel>
                        <StyledInput
                            type="text"
                            placeholder="e.g. Annual Sports Day, Exam Schedule, Holiday Notice..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </FieldGroup>

                    {/* AI Generate button */}
                    <AiSection>
                        <AiInfo>
                            <AutoAwesomeRounded sx={{ fontSize: 15, color: '#7c3aed' }} />
                            <span>Let AI write the details based on your title</span>
                        </AiInfo>
                        <AiButton
                            type="button"
                            onClick={generateNotice}
                            disabled={aiLoader}
                            $loading={aiLoader}
                        >
                            {aiLoader ? (
                                <>
                                    <Spinner />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <AutoAwesomeRounded sx={{ fontSize: 16 }} />
                                    Generate with AI
                                </>
                            )}
                        </AiButton>
                    </AiSection>

                    {/* Details field */}
                    <FieldGroup>
                        <FieldLabelRow>
                            <FieldLabel>
                                <NotesRounded sx={{ fontSize: 16, color: '#4f46e5' }} />
                                Notice Details <Required>*</Required>
                            </FieldLabel>
                            <FieldMeta>
                                {aiUsed && (
                                    <AiChip>
                                        <AutoAwesomeRounded sx={{ fontSize: 11 }} />
                                        AI generated
                                    </AiChip>
                                )}
                                <WordCount>{wordCount} words</WordCount>
                            </FieldMeta>
                        </FieldLabelRow>
                        <StyledTextarea
                            placeholder="Write the full notice content here, or use AI to generate it automatically..."
                            value={details}
                            onChange={e => { setDetails(e.target.value); setAiUsed(false); }}
                            required
                            rows={10}
                            $hasContent={!!details}
                        />
                    </FieldGroup>

                    {/* Date field */}
                    <FieldGroup>
                        <FieldLabel>
                            <CalendarTodayRounded sx={{ fontSize: 16, color: '#4f46e5' }} />
                            Notice Date <Required>*</Required>
                        </FieldLabel>
                        <DateInputWrapper>
                            <StyledInput
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required
                                style={{ maxWidth: 260 }}
                            />
                        </DateInputWrapper>
                    </FieldGroup>

                    {/* Submit */}
                    <SubmitRow>
                        <CancelBtn type="button" onClick={() => navigate('/Admin/notices')}>
                            Cancel
                        </CancelBtn>
                        <SubmitBtn type="submit" disabled={loader}>
                            {loader ? (
                                <>
                                    <CircularProgress size={18} sx={{ color: '#fff' }} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <AddCircleOutlineRounded sx={{ fontSize: 18 }} />
                                    Post Notice
                                </>
                            )}
                        </SubmitBtn>
                    </SubmitRow>
                </FormBody>
            </FormCard>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </PageWrapper>
    );
};

export default AddNotice;

// ─── Styled Components ────────────────────────────────────────────────────────
const PageWrapper = styled.div`
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 8px 0 40px;
    font-family: 'Plus Jakarta Sans', sans-serif;
`;

const FormCard = styled.div`
    width: 100%;
    max-width: 780px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    overflow: hidden;
    animation: ${fadeUp} 0.4s ease both;
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 28px 32px;
    background: linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%);
    border-bottom: 1px solid #e8ecf8;
`;

const HeaderIcon = styled.div`
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: #eef2ff;
    border: 1px solid #e0e7ff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

const HeaderText = styled.div`
    flex: 1;
`;

const CardTitle = styled.h2`
    font-size: 1.3rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px;
    letter-spacing: -0.02em;
`;

const CardSubtitle = styled.p`
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
`;

const AiBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 99px;
    flex-shrink: 0;
`;

const Divider = styled.div`
    height: 1px;
    background: #f1f5f9;
`;

const FormBody = styled.form`
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const FieldLabelRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
`;

const FieldLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.875rem;
    font-weight: 700;
    color: #374151;
`;

const FieldMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Required = styled.span`
    color: #ef4444;
`;

const WordCount = styled.span`
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 500;
`;

const AiChip = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #f3e8ff;
    color: #7c3aed;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 99px;
`;

const StyledInput = styled.input`
    width: 100%;
    padding: 13px 16px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9375rem;
    color: #0f172a;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    outline: none;

    &:focus {
        border-color: #4f46e5;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    &::placeholder {
        color: #cbd5e1;
    }
`;

const StyledTextarea = styled.textarea`
    width: 100%;
    padding: 16px;
    background: ${p => p.$hasContent ? '#ffffff' : '#f8fafc'};
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9375rem;
    color: #0f172a;
    line-height: 1.7;
    resize: vertical;
    min-height: 220px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    outline: none;

    &:focus {
        border-color: #4f46e5;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    &::placeholder {
        color: #cbd5e1;
    }
`;

const DateInputWrapper = styled.div`
    display: flex;
    align-items: center;
`;

/* AI section */
const AiSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    background: linear-gradient(135deg, #faf5ff 0%, #f0f4ff 100%);
    border: 1px dashed #c4b5fd;
    border-radius: 12px;
    padding: 14px 18px;
`;

const AiInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    color: #6d28d9;
    font-weight: 500;
`;

const Spinner = styled.span`
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ${spin} 0.7s linear infinite;
    flex-shrink: 0;
`;

const AiButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border: none;
    border-radius: 10px;
    background: ${p => p.$loading
        ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
        : 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'};
    background-size: 200% auto;
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: ${p => p.$loading ? 'wait' : 'pointer'};
    box-shadow: 0 3px 14px rgba(124, 58, 237, 0.3);
    transition: opacity 0.2s ease, transform 0.15s ease;
    flex-shrink: 0;

    &:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
    }
    &:active:not(:disabled) {
        transform: translateY(0);
    }
    &:disabled {
        opacity: 0.75;
    }
`;

/* Submit row */
const SubmitRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 8px;
    border-top: 1px solid #f1f5f9;
`;

const CancelBtn = styled.button`
    padding: 11px 24px;
    background: transparent;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

    &:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        color: #0f172a;
    }
`;

const SubmitBtn = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 28px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 3px 14px rgba(79, 70, 229, 0.28);
    transition: opacity 0.2s ease, transform 0.15s ease;

    &:hover:not(:disabled) {
        opacity: 0.92;
        transform: translateY(-1px);
    }
    &:active:not(:disabled) {
        transform: translateY(0);
    }
    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;