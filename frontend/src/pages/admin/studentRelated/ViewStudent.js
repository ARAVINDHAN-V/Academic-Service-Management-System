import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const deleteHandler = async () => {
  try {
    await axios.delete(`http://localhost:5000/Student/${studentID}`);

    setMessage("✅ Student deleted successfully");
    setShowPopup(true);

    // redirect after delete
    navigate("/Admin/students");

  } catch (err) {
    console.log(err);

    setMessage("❌ Delete failed");
    setShowPopup(true);
  }
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
                  <StyledTableCell>AI Feedback</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
  {subjectMarks.map((m, i) => (
    <React.Fragment key={i}>
      
      {/* Main Row */}
      <StyledTableRow hover>
        <StyledTableCell>{m.subName?.subName}</StyledTableCell>
        <StyledTableCell>{m.marksObtained}</StyledTableCell>

        <StyledTableCell>
          {m.suggestion ? (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "#f5f9ff",
                border: "1px solid #1976d2",
                minWidth: 200
              }}
            >
              <Typography variant="body2" fontWeight="bold" color="primary">
                🎯 {m.suggestion.performance}
              </Typography>

              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {m.suggestion.advice}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: m.suggestion.attendanceMsg?.includes("⚠️")
                    ? "red"
                    : "green"
                }}
              >
                {m.suggestion.attendanceMsg}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No feedback yet
            </Typography>
          )}
        </StyledTableCell>
      </StyledTableRow>

    </React.Fragment>
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

