import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUser } from "../../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import {
  Avatar,Box,Button,Card,CardContent,Chip,Collapse,Container,Grid,IconButton,Paper,Tab,Table,TableBody,TableHead,Typography,
  BottomNavigation,BottomNavigationAction,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Class as ClassIcon,
} from "@mui/icons-material";
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from "../../../components/attendanceCalculator";
import CustomBarChart from "../../../components/CustomBarChart";
import CustomPieChart from "../../../components/CustomPieChart";
import { StyledTableCell, StyledTableRow } from "../../../components/styles";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import Popup from "../../../components/Popup";

const ViewStudent = () => {
  const [value, setValue] = useState("1");
  const [selectedSection, setSelectedSection] = useState("table");
  const [openStates, setOpenStates] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { userDetails, loading } = useSelector((state) => state.user);

  const studentID = params.id;

  useEffect(() => {
    dispatch(getUserDetails(studentID, "Student"));
  }, [dispatch, studentID]);

  useEffect(() => {
    if (userDetails?.sclassName?._id) {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails]);

  // Attendance + Marks data
  const subjectAttendance = userDetails?.attendance || [];
  const subjectMarks = userDetails?.examResult || [];

  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
    ([subName, { present, sessions }]) => ({
      subject: subName,
      attendancePercentage: calculateSubjectAttendancePercentage(present, sessions),
      totalClasses: sessions,
      attendedClasses: present,
    })
  );

  // Tab change
  const handleChange = (event, newValue) => setValue(newValue);

  // Attendance table expand/collapse
  const handleOpen = (subId) => {
    setOpenStates((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  // Delete disabled
  const deleteHandler = () => {
    setMessage("❌ Delete is disabled for now.");
    setShowPopup(true);
  };

  /** --- Student Details Card --- */
  const StudentDetailsSection = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: "2rem" }}
            >
              {userDetails?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {userDetails?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Roll No: {userDetails?.rollNum}
              </Typography>
            </Box>
          </Box>

          <CardContent>
            <Box mt={2} display="flex" gap={1} flexWrap="wrap">
              <Chip icon={<ClassIcon />} label={`Class: ${userDetails?.sclassName?.sclassName}`} color="secondary" />
              <Chip icon={<SchoolIcon />} label={`School: ${userDetails?.school?.schoolName}`} color="primary" />
            </Box>
          </CardContent>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={deleteHandler}
            sx={{ mt: 2 }}
          >
            Delete Student
          </Button>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        {subjectAttendance?.length > 0 && (
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
            <Typography variant="h6" gutterBottom>
              Attendance Overview
            </Typography>
            <CustomPieChart data={chartData} />
          </Card>
        )}
      </Grid>
    </Grid>
  );

  /** --- Attendance Section --- */
  const StudentAttendanceSection = () => (
    <>
      {subjectAttendance.length > 0 ? (
        <>
          {selectedSection === "table" ? (
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Subject</StyledTableCell>
                  <StyledTableCell>Present</StyledTableCell>
                  <StyledTableCell>Total Sessions</StyledTableCell>
                  <StyledTableCell>Percentage</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
                  ([subName, { present, allData, subId, sessions }], i) => {
                    const percent = calculateSubjectAttendancePercentage(present, sessions);
                    return (
                      <React.Fragment key={i}>
                        <StyledTableRow hover>
                          <StyledTableCell>{subName}</StyledTableCell>
                          <StyledTableCell>{present}</StyledTableCell>
                          <StyledTableCell>{sessions}</StyledTableCell>
                          <StyledTableCell>{percent}%</StyledTableCell>
                          <StyledTableCell>
                            <Button onClick={() => handleOpen(subId)}>
                              {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell colSpan={5} sx={{ p: 0 }}>
                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                              <Box p={2}>
                                <Typography variant="subtitle1">Details:</Typography>
                                {allData.map((d, idx) => (
                                  <Typography key={idx} variant="body2">
                                    {new Date(d.date).toLocaleDateString()} - {d.status}
                                  </Typography>
                                ))}
                              </Box>
                            </Collapse>
                          </StyledTableCell>
                        </StyledTableRow>
                      </React.Fragment>
                    );
                  }
                )}
              </TableBody>
            </Table>
          ) : (
            <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
          )}

          {/* Floating Bottom Navigation */}
          <Paper
            sx={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              borderRadius: 3,
              width: 300,
              boxShadow: 6,
            }}
          >
            <BottomNavigation value={selectedSection} onChange={(e, v) => setSelectedSection(v)}>
              <BottomNavigationAction value="table" label="Table" icon={<TableChartIcon />} />
              <BottomNavigationAction value="chart" label="Chart" icon={<InsertChartIcon />} />
            </BottomNavigation>
          </Paper>
        </>
      ) : (
        <Button variant="contained" onClick={() => navigate(`/Admin/students/student/attendance/${studentID}`)}>
          Add Attendance
        </Button>
      )}
    </>
  );

  /** --- Marks Section --- */
  const StudentMarksSection = () => (
    <>
      {subjectMarks.length > 0 ? (
        <>
          {selectedSection === "table" ? (
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Subject</StyledTableCell>
                  <StyledTableCell>Marks</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {subjectMarks.map((m, i) => (
                  <StyledTableRow key={i} hover>
                    <StyledTableCell>{m.subName?.subName}</StyledTableCell>
                    <StyledTableCell>{m.marksObtained}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
          )}

          <Paper
            sx={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              borderRadius: 3,
              width: 300,
              boxShadow: 6,
            }}
          >
            <BottomNavigation value={selectedSection} onChange={(e, v) => setSelectedSection(v)}>
              <BottomNavigationAction value="table" label="Table" icon={<TableChartOutlinedIcon />} />
              <BottomNavigationAction value="chart" label="Chart" icon={<InsertChartOutlinedIcon />} />
            </BottomNavigation>
          </Paper>
        </>
      ) : (
        <Button variant="contained" onClick={() => navigate(`/Admin/students/student/marks/${studentID}`)}>
          Add Marks
        </Button>
      )}
    </>
  );

  return (
    <>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box sx={{ width: "100%" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white", position: "sticky", top: 0, zIndex: 10 }}>
              <TabList onChange={handleChange}>
                <Tab label="Details" value="1" />
                <Tab label="Attendance" value="2" />
                <Tab label="Marks" value="3" />
              </TabList>
            </Box>
            <Container sx={{ py: 4 }}>
              <TabPanel value="1">
                <StudentDetailsSection />
              </TabPanel>
              <TabPanel value="2">
                <StudentAttendanceSection />
              </TabPanel>
              <TabPanel value="3">
                <StudentMarksSection />
              </TabPanel>
            </Container>
          </TabContext>
        </Box>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default ViewStudent;


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
// import { useNavigate, useParams } from 'react-router-dom'
// import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
// import { Box, Button, Collapse, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container } from '@mui/material';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
// import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon } from '@mui/icons-material';
// import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
// import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
// import CustomBarChart from '../../../components/CustomBarChart'
// import CustomPieChart from '../../../components/CustomPieChart'
// import { StyledTableCell, StyledTableRow } from '../../../components/styles';

// import InsertChartIcon from '@mui/icons-material/InsertChart';
// import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
// import TableChartIcon from '@mui/icons-material/TableChart';
// import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
// import Popup from '../../../components/Popup';

// const ViewStudent = () => {
//     const [showTab, setShowTab] = useState(false);

//     const navigate = useNavigate()
//     const params = useParams()
//     const dispatch = useDispatch()
//     const { userDetails, response, loading, error } = useSelector((state) => state.user);

//     const studentID = params.id
//     const address = "Student"

//     useEffect(() => {
//         dispatch(getUserDetails(studentID, address));
//     }, [dispatch, studentID])

//     useEffect(() => {
//         if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
//             dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
//         }
//     }, [dispatch, userDetails]);

//     if (response) { console.log(response) }
//     else if (error) { console.log(error) }

//     const [name, setName] = useState('');
//     const [rollNum, setRollNum] = useState('');
//     const [password, setPassword] = useState('');
//     const [sclassName, setSclassName] = useState('');
//     const [studentSchool, setStudentSchool] = useState('');
//     const [subjectMarks, setSubjectMarks] = useState('');
//     const [subjectAttendance, setSubjectAttendance] = useState([]);

//     const [openStates, setOpenStates] = useState({});

//     const [showPopup, setShowPopup] = useState(false);
//     const [message, setMessage] = useState("");

//     const handleOpen = (subId) => {
//         setOpenStates((prevState) => ({
//             ...prevState,
//             [subId]: !prevState[subId],
//         }));
//     };

//     const [value, setValue] = useState('1');

//     const handleChange = (event, newValue) => {
//         setValue(newValue);
//     };

//     const [selectedSection, setSelectedSection] = useState('table');
//     const handleSectionChange = (event, newSection) => {
//         setSelectedSection(newSection);
//     };

//     const fields = password === ""
//         ? { name, rollNum }
//         : { name, rollNum, password }

//     useEffect(() => {
//         if (userDetails) {
//             setName(userDetails.name || '');
//             setRollNum(userDetails.rollNum || '');
//             setSclassName(userDetails.sclassName || '');
//             setStudentSchool(userDetails.school || '');
//             setSubjectMarks(userDetails.examResult || '');
//             setSubjectAttendance(userDetails.attendance || []);
//         }
//     }, [userDetails]);

//     const submitHandler = (event) => {
//         event.preventDefault()
//         dispatch(updateUser(fields, studentID, address))
//             .then(() => {
//                 dispatch(getUserDetails(studentID, address));
//             })
//             .catch((error) => {
//                 console.error(error)
//             })
//     }

//     const deleteHandler = () => {
//         setMessage("Sorry the delete function has been disabled for now.")
//         setShowPopup(true)

//         // dispatch(deleteUser(studentID, address))
//         //     .then(() => {
//         //         navigate(-1)
//         //     })
//     }

//     const removeHandler = (id, deladdress) => {
//         dispatch(removeStuff(id, deladdress))
//             .then(() => {
//                 dispatch(getUserDetails(studentID, address));
//             })
//     }

//     const removeSubAttendance = (subId) => {
//         dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
//             .then(() => {
//                 dispatch(getUserDetails(studentID, address));
//             })
//     }

//     const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
//     const overallAbsentPercentage = 100 - overallAttendancePercentage;

//     const chartData = [
//         { name: 'Present', value: overallAttendancePercentage },
//         { name: 'Absent', value: overallAbsentPercentage }
//     ];

//     const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
//         const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
//         return {
//             subject: subName,
//             attendancePercentage: subjectAttendancePercentage,
//             totalClasses: sessions,
//             attendedClasses: present
//         };
//     });

//     const StudentAttendanceSection = () => {
//         const renderTableSection = () => {
//             return (
//                 <>
//                     <h3>Attendance:</h3>
//                     <Table>
//                         <TableHead>
//                             <StyledTableRow>
//                                 <StyledTableCell>Subject</StyledTableCell>
//                                 <StyledTableCell>Present</StyledTableCell>
//                                 <StyledTableCell>Total Sessions</StyledTableCell>
//                                 <StyledTableCell>Attendance Percentage</StyledTableCell>
//                                 <StyledTableCell align="center">Actions</StyledTableCell>
//                             </StyledTableRow>
//                         </TableHead>
//                         {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
//                             const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
//                             return (
//                                 <TableBody key={index}>
//                                     <StyledTableRow>
//                                         <StyledTableCell>{subName}</StyledTableCell>
//                                         <StyledTableCell>{present}</StyledTableCell>
//                                         <StyledTableCell>{sessions}</StyledTableCell>
//                                         <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
//                                         <StyledTableCell align="center">
//                                             <Button variant="contained"
//                                                 onClick={() => handleOpen(subId)}>
//                                                 {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
//                                             </Button>
//                                             <IconButton onClick={() => removeSubAttendance(subId)}>
//                                                 <DeleteIcon color="error" />
//                                             </IconButton>
//                                             <Button variant="contained" sx={styles.attendanceButton}
//                                                 onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}>
//                                                 Change
//                                             </Button>
//                                         </StyledTableCell>
//                                     </StyledTableRow>
//                                     <StyledTableRow>
//                                         <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//                                             <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
//                                                 <Box sx={{ margin: 1 }}>
//                                                     <Typography variant="h6" gutterBottom component="div">
//                                                         Attendance Details
//                                                     </Typography>
//                                                     <Table size="small" aria-label="purchases">
//                                                         <TableHead>
//                                                             <StyledTableRow>
//                                                                 <StyledTableCell>Date</StyledTableCell>
//                                                                 <StyledTableCell align="right">Status</StyledTableCell>
//                                                             </StyledTableRow>
//                                                         </TableHead>
//                                                         <TableBody>
//                                                             {allData.map((data, index) => {
//                                                                 const date = new Date(data.date);
//                                                                 const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
//                                                                 return (
//                                                                     <StyledTableRow key={index}>
//                                                                         <StyledTableCell component="th" scope="row">
//                                                                             {dateString}
//                                                                         </StyledTableCell>
//                                                                         <StyledTableCell align="right">{data.status}</StyledTableCell>
//                                                                     </StyledTableRow>
//                                                                 )
//                                                             })}
//                                                         </TableBody>
//                                                     </Table>
//                                                 </Box>
//                                             </Collapse>
//                                         </StyledTableCell>
//                                     </StyledTableRow>
//                                 </TableBody>
//                             )
//                         }
//                         )}
//                     </Table>
//                     <div>
//                         Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
//                     </div>
//                     <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => removeHandler(studentID, "RemoveStudentAtten")}>Delete All</Button>
//                     <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
//                         Add Attendance
//                     </Button>
//                 </>
//             )
//         }
//         const renderChartSection = () => {
//             return (
//                 <>
//                     <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
//                 </>
//             )
//         }
//         return (
//             <>
//                 {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0
//                     ?
//                     <>
//                         {selectedSection === 'table' && renderTableSection()}
//                         {selectedSection === 'chart' && renderChartSection()}

//                         <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
//                             <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
//                                 <BottomNavigationAction
//                                     label="Table"
//                                     value="table"
//                                     icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
//                                 />
//                                 <BottomNavigationAction
//                                     label="Chart"
//                                     value="chart"
//                                     icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
//                                 />
//                             </BottomNavigation>
//                         </Paper>
//                     </>
//                     :
//                     <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
//                         Add Attendance
//                     </Button>
//                 }
//             </>
//         )
//     }

//     const StudentMarksSection = () => {
//         const renderTableSection = () => {
//             return (
//                 <>
//                     <h3>Subject Marks:</h3>
//                     <Table>
//                         <TableHead>
//                             <StyledTableRow>
//                                 <StyledTableCell>Subject</StyledTableCell>
//                                 <StyledTableCell>Marks</StyledTableCell>
//                             </StyledTableRow>
//                         </TableHead>
//                         <TableBody>
//                             {subjectMarks.map((result, index) => {
//                                 if (!result.subName || !result.marksObtained) {
//                                     return null;
//                                 }
//                                 return (
//                                     <StyledTableRow key={index}>
//                                         <StyledTableCell>{result.subName.subName}</StyledTableCell>
//                                         <StyledTableCell>{result.marksObtained}</StyledTableCell>
//                                     </StyledTableRow>
//                                 );
//                             })}
//                         </TableBody>
//                     </Table>
//                     <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
//                         Add Marks
//                     </Button>
//                 </>
//             )
//         }
//         const renderChartSection = () => {
//             return (
//                 <>
//                     <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
//                 </>
//             )
//         }
//         return (
//             <>
//                 {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
//                     ?
//                     <>
//                         {selectedSection === 'table' && renderTableSection()}
//                         {selectedSection === 'chart' && renderChartSection()}

//                         <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
//                             <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
//                                 <BottomNavigationAction
//                                     label="Table"
//                                     value="table"
//                                     icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
//                                 />
//                                 <BottomNavigationAction
//                                     label="Chart"
//                                     value="chart"
//                                     icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
//                                 />
//                             </BottomNavigation>
//                         </Paper>
//                     </>
//                     :
//                     <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
//                         Add Marks
//                     </Button>
//                 }
//             </>
//         )
//     }

//     const StudentDetailsSection = () => {
//         return (
//             <div>
//                 Name: {userDetails.name}
//                 <br />
//                 Roll Number: {userDetails.rollNum}
//                 <br />
//                 Class: {sclassName.sclassName}
//                 <br />
//                 School: {studentSchool.schoolName}
//                 {
//                     subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
//                         <CustomPieChart data={chartData} />
//                     )
//                 }
//                 <Button variant="contained" sx={styles.styledButton} onClick={deleteHandler}>
//                     Delete
//                 </Button>
//                 <br />
//                 {/* <Button variant="contained" sx={styles.styledButton} className="show-tab" onClick={() => { setShowTab(!showTab) }}>
//                     {
//                         showTab
//                             ? <KeyboardArrowUp />
//                             : <KeyboardArrowDown />
//                     }
//                     Edit Student
//                 </Button>
//                 <Collapse in={showTab} timeout="auto" unmountOnExit>
//                     <div className="register">
//                         <form className="registerForm" onSubmit={submitHandler}>
//                             <span className="registerTitle">Edit Details</span>
//                             <label>Name</label>
//                             <input className="registerInput" type="text" placeholder="Enter user's name..."
//                                 value={name}
//                                 onChange={(event) => setName(event.target.value)}
//                                 autoComplete="name" required />

//                             <label>Roll Number</label>
//                             <input className="registerInput" type="number" placeholder="Enter user's Roll Number..."
//                                 value={rollNum}
//                                 onChange={(event) => setRollNum(event.target.value)}
//                                 required />

//                             <label>Password</label>
//                             <input className="registerInput" type="password" placeholder="Enter user's password..."
//                                 value={password}
//                                 onChange={(event) => setPassword(event.target.value)}
//                                 autoComplete="new-password" />

//                             <button className="registerButton" type="submit" >Update</button>
//                         </form>
//                     </div>
//                 </Collapse> */}
//             </div>
//         )
//     }

//     return (
//         <>
//             {loading
//                 ?
//                 <>
//                     <div>Loading...</div>
//                 </>
//                 :
//                 <>
//                     <Box sx={{ width: '100%', typography: 'body1', }} >
//                         <TabContext value={value}>
//                             <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                                 <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
//                                     <Tab label="Details" value="1" />
//                                     <Tab label="Attendance" value="2" />
//                                     <Tab label="Marks" value="3" />
//                                 </TabList>
//                             </Box>
//                             <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
//                                 <TabPanel value="1">
//                                     <StudentDetailsSection />
//                                 </TabPanel>
//                                 <TabPanel value="2">
//                                     <StudentAttendanceSection />
//                                 </TabPanel>
//                                 <TabPanel value="3">
//                                     <StudentMarksSection />
//                                 </TabPanel>
//                             </Container>
//                         </TabContext>
//                     </Box>
//                 </>
//             }
//             <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

//         </>
//     )
// }

// export default ViewStudent

// const styles = {
//     attendanceButton: {
//         marginLeft: "20px",
//         backgroundColor: "#270843",
//         "&:hover": {
//             backgroundColor: "#3f1068",
//         }
//     },
//     styledButton: {
//         margin: "20px",
//         backgroundColor: "#02250b",
//         "&:hover": {
//             backgroundColor: "#106312",
//         }
//     }
// }