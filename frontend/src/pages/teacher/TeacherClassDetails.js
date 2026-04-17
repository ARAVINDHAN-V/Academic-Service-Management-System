import React, { useEffect, useState } from "react";
import axios from "axios";

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";

import {
    Paper, Box, Typography, ButtonGroup, Button,
    Popper, Grow, ClickAwayListener, MenuList, MenuItem,
    Collapse, IconButton
} from '@mui/material';

import {
    KeyboardArrowDown, KeyboardArrowUp
} from "@mui/icons-material";

import CloseIcon from '@mui/icons-material/Close';

import { BlackButton, BlueButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";

const TeacherClassDetails = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector((state) => state.user);

    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;

    // ✅ Attendance Risk State
    const [riskStudents, setRiskStudents] = useState([]);
    const [showAlert, setShowAlert] = useState(true);

    // ✅ Fetch class students
    useEffect(() => {
        dispatch(getClassStudents(classID));
    }, [dispatch, classID]);

    // ✅ Fetch attendance risk students
    useEffect(() => {
        axios.get("http://localhost:5000/attendance-risk")
            .then(res => {console.log("API DATA:", res.data);  
                setRiskStudents(res.data);})
            .catch(err => console.log(err));
    }, []);

    if (error) {
        console.log(error);
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ];

    const studentRows = sclassStudents.map((student) => ({
        name: student.name,
        rollNum: student.rollNum,
        id: student._id,
    }));

    // ✅ Action buttons per student
    const StudentsButtonHaver = ({ row }) => {

        const options = ['Take Attendance', 'Provide Marks'];
        const [open, setOpen] = useState(false);
        const anchorRef = React.useRef(null);
        const [selectedIndex, setSelectedIndex] = useState(0);

        const handleClick = () => {
            if (selectedIndex === 0) {
                navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`);
            } else {
                navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`);
            }
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
        };

        return (
            <>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Teacher/class/student/" + row.id)}
                    sx={{ mr: 1 }}
                >
                    View
                </BlueButton>

                <ButtonGroup variant="contained" ref={anchorRef}>
                    <Button onClick={handleClick}>
                        {options[selectedIndex]}
                    </Button>

                    <BlackButton onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </BlackButton>
                </ButtonGroup>

                <Popper open={open} anchorEl={anchorRef.current} transition>
                    {({ TransitionProps }) => (
                        <Grow {...TransitionProps}>
                            <Paper>
                                <ClickAwayListener onClickAway={() => setOpen(false)}>
                                    <MenuList>
                                        {options.map((option, index) => (
                                            <MenuItem
                                                key={option}
                                                selected={index === selectedIndex}
                                                onClick={(event) => handleMenuItemClick(event, index)}
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </>
        );
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Class Details
                    </Typography>

                    {/* ✅ Attendance Risk Alert */}
                    {riskStudents.length > 0 && (
                        <Collapse in={showAlert}>
                            <Paper sx={{ p: 2, mb: 2, backgroundColor: '#fff3cd' }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography fontWeight="bold">
                                        ⚠ Attendance Risk Alerts — {riskStudents.length} students
                                    </Typography>

                                    <IconButton onClick={() => setShowAlert(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                {riskStudents.map((student, i) => (
                                    <Typography key={i} sx={{ mt: 1 }}>
                                        <strong>{student.name}</strong> → {student.message}
                                    </Typography>
                                ))}
                            </Paper>
                        </Collapse>
                    )}

                    {getresponse ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            No Students Found
                        </Box>
                    ) : (
                        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                Students List
                            </Typography>

                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 && (
                                <TableTemplate
                                    buttonHaver={StudentsButtonHaver}
                                    columns={studentColumns}
                                    rows={studentRows}
                                />
                            )}
                        </Paper>
                    )}
                </>
            )}
        </>
    );
};

export default TeacherClassDetails;