import React, { useEffect, useState } from "react";
import { getClassStudents, getSubjectDetails } from "../../../redux/sclassRelated/sclassHandle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Tab,
  Container,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import BookIcon from "@mui/icons-material/Book";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PeopleIcon from "@mui/icons-material/People";
import ClassIcon from "@mui/icons-material/Class";
import PersonIcon from "@mui/icons-material/Person";

const ViewSubject = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector(
    (state) => state.sclass
  );

  const { classID, subjectID } = params;

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error);
  }

  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => setValue(newValue);

  const [selectedSection, setSelectedSection] = useState("attendance");
  const handleSectionChange = (event, newSection) => setSelectedSection(newSection);

  // Columns + rows for table
  const studentColumns = [
    { id: "rollNum", label: "Roll No.", minWidth: 100 },
    { id: "name", label: "Name", minWidth: 170 },
  ];

  const studentRows = sclassStudents.map((student) => ({
    rollNum: student.rollNum,
    name: student.name,
    id: student._id,
  }));

  const StudentsAttendanceButtonHaver = ({ row }) => (
    <>
      <BlueButton variant="contained" onClick={() => navigate("/Admin/students/student/" + row.id)} sx={{ mr: 1 }} >
        View
      </BlueButton>
      <PurpleButton
        variant="contained"
        onClick={() => navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)}
      >
        Take Attendance
      </PurpleButton>
    </>
  );

  const StudentsMarksButtonHaver = ({ row }) => (
    <>
      <BlueButton variant="contained" onClick={() => navigate("/Admin/students/student/" + row.id)}>
        View
      </BlueButton>
      <PurpleButton
        variant="contained"
        onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}
      >
        Provide Marks
      </PurpleButton>
    </>
  );

  const SubjectStudentsSection = () => (
    <>
      {getresponse ? (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
          >
            Add Students
          </GreenButton>
        </Box>
      ) : (
        <>
          <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Students List
            </Typography>

            {selectedSection === "attendance" && (
              <TableTemplate
                buttonHaver={StudentsAttendanceButtonHaver}
                columns={studentColumns}
                rows={studentRows}
              />
            )}
            {selectedSection === "marks" && (
              <TableTemplate
                buttonHaver={StudentsMarksButtonHaver}
                columns={studentColumns}
                rows={studentRows}
              />
            )}
          </Card>

          <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={6}>
            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
              <BottomNavigationAction
                label="Attendance"
                value="attendance"
                icon={
                  selectedSection === "attendance" ? <TableChartIcon /> : <TableChartOutlinedIcon />
                }
              />
              <BottomNavigationAction
                label="Marks"
                value="marks"
                icon={
                  selectedSection === "marks" ? <InsertChartIcon /> : <InsertChartOutlinedIcon />
                }
              />
            </BottomNavigation>
          </Paper>
        </>
      )}
    </>
  );

  const SubjectDetailsSection = () => {
  const numberOfStudents = sclassStudents.length;

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 4,
          width: "100%",
          maxWidth: { xs: "95%", sm: 700 }, // responsive max width
          mx: "auto",                          // centers inside parent
          mt: 8,                               // small top spacing
          mb: 5,                               // proper bottom spacing
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          Subject Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <BookIcon color="primary" />
              <Typography>{subjectDetails?.subName || "N/A"}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <ConfirmationNumberIcon color="secondary" />
              <Typography>Code: {subjectDetails?.subCode || "N/A"}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <ScheduleIcon color="success" />
              <Typography>Sessions: {subjectDetails?.sessions || "N/A"}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <PeopleIcon color="info" />
              <Typography>Students: {numberOfStudents}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <ClassIcon color="warning" />
              <Typography>
                Class: {subjectDetails?.sclassName?.sclassName || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            {subjectDetails?.teacher ? (
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon color="error" />
                <Typography>Teacher: {subjectDetails.teacher.name}</Typography>
              </Box>
            ) : (
              <GreenButton
                variant="contained"
                onClick={() =>
                  navigate("/Admin/teachers/addteacher/" + subjectDetails._id)
                }
              >
                ➕ Assign Teacher
              </GreenButton>
            )}
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

  return subloading ? (
    <Typography variant="h6">Loading...</Typography>
  ) : (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <TabList
            onChange={handleChange}
            sx={{ position: "fixed", width: "100%", bgcolor: "white", zIndex: 10 }}
          >
            <Tab label="Details" value="1" />
            <Tab label="Students" value="2" />
          </TabList>
        </Box>
        <Container sx={{ mt: "4rem", mb: "4rem" }}>
          <TabPanel value="1">
            <SubjectDetailsSection />
          </TabPanel>
          <TabPanel value="2">
            <SubjectStudentsSection />
          </TabPanel>
        </Container>
      </TabContext>
    </Box>
  );
};

export default ViewSubject;



// import React, { useEffect, useState } from 'react'
// import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
// import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
// import TableTemplate from '../../../components/TableTemplate';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';

// import InsertChartIcon from '@mui/icons-material/InsertChart';
// import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
// import TableChartIcon from '@mui/icons-material/TableChart';
// import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// const ViewSubject = () => {
//   const navigate = useNavigate()
//   const params = useParams()
//   const dispatch = useDispatch();
//   const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

//   const { classID, subjectID } = params

//   useEffect(() => {
//     dispatch(getSubjectDetails(subjectID, "Subject"));
//     dispatch(getClassStudents(classID));
//   }, [dispatch, subjectID, classID]);

//   if (error) {
//     console.log(error)
//   }

//   const [value, setValue] = useState('1');

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const [selectedSection, setSelectedSection] = useState('attendance');
//   const handleSectionChange = (event, newSection) => {
//     setSelectedSection(newSection);
//   };

//   const studentColumns = [
//     { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
//     { id: 'name', label: 'Name', minWidth: 170 },
//   ]

//   const studentRows = sclassStudents.map((student) => {
//     return {
//       rollNum: student.rollNum,
//       name: student.name,
//       id: student._id,
//     };
//   })

//   const StudentsAttendanceButtonHaver = ({ row }) => {
//     return (
//       <>
//         <BlueButton
//           variant="contained"
//           onClick={() => navigate("/Admin/students/student/" + row.id)}
//         >
//           View
//         </BlueButton>
//         <PurpleButton
//           variant="contained"
//           onClick={() =>
//             navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
//           }
//         >
//           Take Attendance
//         </PurpleButton>
//       </>
//     );
//   };

//   const StudentsMarksButtonHaver = ({ row }) => {
//     return (
//       <>
//         <BlueButton
//           variant="contained"
//           onClick={() => navigate("/Admin/students/student/" + row.id)}
//         >
//           View
//         </BlueButton>
//         <PurpleButton variant="contained"
//           onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>
//           Provide Marks
//         </PurpleButton>
//       </>
//     );
//   };

//   const SubjectStudentsSection = () => {
//     return (
//       <>
//         {getresponse ? (
//           <>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
//               <GreenButton
//                 variant="contained"
//                 onClick={() => navigate("/Admin/class/addstudents/" + classID)}
//               >
//                 Add Students
//               </GreenButton>
//             </Box>
//           </>
//         ) : (
//           <>
//             <Typography variant="h5" gutterBottom>
//               Students List:
//             </Typography>

//             {selectedSection === 'attendance' &&
//               <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
//             }
//             {selectedSection === 'marks' &&
//               <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
//             }

//             <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
//               <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
//                 <BottomNavigationAction
//                   label="Attendance"
//                   value="attendance"
//                   icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
//                 />
//                 <BottomNavigationAction
//                   label="Marks"
//                   value="marks"
//                   icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
//                 />
//               </BottomNavigation>
//             </Paper>

//           </>
//         )}
//       </>
//     )
//   }

//   const SubjectDetailsSection = () => {
//     const numberOfStudents = sclassStudents.length;

//     return (
//       <>
//         <Typography variant="h4" align="center" gutterBottom>
//           Subject Details
//         </Typography>
//         <Typography variant="h6" gutterBottom>
//           Subject Name : {subjectDetails && subjectDetails.subName}
//         </Typography>
//         <Typography variant="h6" gutterBottom>
//           Subject Code : {subjectDetails && subjectDetails.subCode}
//         </Typography>
//         <Typography variant="h6" gutterBottom>
//           Subject Sessions : {subjectDetails && subjectDetails.sessions}
//         </Typography>
//         <Typography variant="h6" gutterBottom>
//           Number of Students: {numberOfStudents}
//         </Typography>
//         <Typography variant="h6" gutterBottom>
//           Class Name : {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
//         </Typography>
//         {subjectDetails && subjectDetails.teacher ?
//           <Typography variant="h6" gutterBottom>
//             Teacher Name : {subjectDetails.teacher.name}
//           </Typography>
//           :
//           <GreenButton variant="contained"
//             onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}>
//             Add Subject Teacher
//           </GreenButton>
//         }
//       </>
//     );
//   }

//   return (
//     <>
//       {subloading ?
//         < div > Loading...</div >
//         :
//         <>
//           <Box sx={{ width: '100%', typography: 'body1', }} >
//             <TabContext value={value}>
//               <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                 <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
//                   <Tab label="Details" value="1" />
//                   <Tab label="Students" value="2" />
//                 </TabList>
//               </Box>
//               <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
//                 <TabPanel value="1">
//                   <SubjectDetailsSection />
//                 </TabPanel>
//                 <TabPanel value="2">
//                   <SubjectStudentsSection />
//                 </TabPanel>
//               </Container>
//             </TabContext>
//           </Box>
//         </>
//       }
//     </>
//   )
// }

// export default ViewSubject