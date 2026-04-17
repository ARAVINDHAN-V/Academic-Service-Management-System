import axios from "axios";
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import Popup from '../../../components/Popup';
import { BlueButton } from '../../../components/buttonStyles';
import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl
} from '@mui/material';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()

    // ✅ AI states
    const [suggestion, setSuggestion] = useState(null);
    const [attendance, setAttendance] = useState("");

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [marksObtained, setMarksObtained] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    const fields = {
        subName: chosenSubName,
        marksObtained,
        suggestion   // ✅ send AI result
    };

    useEffect(() => {
        if (situation === "Student") {
            setStudentID(params.id);
            dispatch(getUserDetails(params.id, "Student"));
        }
        else if (situation === "Subject") {
            const { studentID, subjectID } = params
            setStudentID(studentID);
            dispatch(getUserDetails(studentID, "Student"));
            setChosenSubName(subjectID);
        }
    }, [situation]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    const changeHandler = (event) => {
        const selectedSubject = subjectsList.find(
            (subject) => subject.subName === event.target.value
        );
        setSubjectName(selectedSubject.subName);
        setChosenSubName(selectedSubject._id);
    }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"))
    }

    // ✅ AI Suggestion Function
    const getSuggestion = async () => {
        try {
            const res = await axios.post("http://localhost:5000/grade", {
                marks: Number(marksObtained),
                attendance: Number(attendance || 100),
                subject: subjectName ,  // ✅ pass subject also
             });
            console.log("AI RESPONSE:", res.data);

            setSuggestion(res.data.suggestion);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (response) {
            setLoader(false)
            setShowPopup(true)
            setMessage(response)
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("error")
        }
        else if (statestatus === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Done Successfully")
        }
        if (studentID) {
        dispatch(getUserDetails(studentID, "Student"));
    }
    }, [response, statestatus, error])

    return (
        <>
            {loading
                ?
                <div>Loading...</div>
                :
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                maxWidth: 550,
                                px: 3,
                                py: '100px',
                                width: '100%'
                            }}
                        >
                            <Stack spacing={1} sx={{ mb: 3 }}>
                                <Typography variant="h4">
                                    Student Name: {userDetails.name}
                                </Typography>

                                {currentUser.teachSubject &&
                                    <Typography variant="h6">
                                        Subject: {currentUser.teachSubject?.subName}
                                    </Typography>
                                }
                            </Stack>

                            <form onSubmit={submitHandler}>
                                <Stack spacing={3}>

                                    {situation === "Student" &&
                                        <FormControl fullWidth>
                                            <InputLabel>Select Subject</InputLabel>
                                            <Select
                                                value={subjectName}
                                                onChange={changeHandler}
                                                required
                                            >
                                                {subjectsList ?
                                                    subjectsList.map((subject, index) => (
                                                        <MenuItem key={index} value={subject.subName}>
                                                            {subject.subName}
                                                        </MenuItem>
                                                    ))
                                                    :
                                                    <MenuItem>
                                                        Add Subjects First
                                                    </MenuItem>
                                                }
                                            </Select>
                                        </FormControl>
                                    }

                                    {/* Marks */}
                                    <TextField
                                        type="number"
                                        label='Enter Marks'
                                        value={marksObtained}
                                        required
                                        onChange={(e) => setMarksObtained(e.target.value)}
                                    />

                                    {/* Attendance (for AI) */}
                                    <TextField
                                        type="number"
                                        label='Attendance % (optional)'
                                        value={attendance}
                                        onChange={(e) => setAttendance(e.target.value)}
                                    />

                                    {/* AI Button */}
                                    <BlueButton onClick={getSuggestion}>
                                        Get AI Suggestion
                                    </BlueButton>

                                    {/* AI Result */}
                                    {suggestion && (
  <Box
    sx={{
      mt: 2,
      p: 2,
      borderRadius: 2,
      backgroundColor: "#eef6ff",
      border: "1px solid #1976d2"
    }}
  >
    <Typography variant="h6">🤖 AI Feedback</Typography>

    <Typography>
      <strong>Performance:</strong> {suggestion.performance}
    </Typography>

    <Typography>
      <strong>Advice:</strong> {suggestion.advice}
    </Typography>

    <Typography>
      <strong>Attendance:</strong> {suggestion.attendanceMsg}
    </Typography>
  </Box>
)}
                                </Stack>

                                <BlueButton
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    type="submit"
                                    disabled={loader || !suggestion}
                                >
                                    {loader
                                        ? <CircularProgress size={24} color="inherit" />
                                        : "Submit"}
                                </BlueButton>
                            </form>
                        </Box>
                    </Box>

                    <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                </>
            }
        </>
    )
}

export default StudentExamMarks;