// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
// import { BottomNavigation, BottomNavigationAction, Container, Paper, Table, TableBody, TableHead, Typography } from '@mui/material';
// import { getUserDetails } from '../../redux/userRelated/userHandle';
// import CustomBarChart from '../../components/CustomBarChart'

// import InsertChartIcon from '@mui/icons-material/InsertChart';
// import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
// import TableChartIcon from '@mui/icons-material/TableChart';
// import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
// import { StyledTableCell, StyledTableRow } from '../../components/styles';

// const StudentSubjects = () => {

//     const dispatch = useDispatch();
//     const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
//     const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

//     useEffect(() => {
//         dispatch(getUserDetails(currentUser._id, "Student"));
//     }, [dispatch, currentUser._id])

//     if (response) { console.log(response) }
//     else if (error) { console.log(error) }

//     const [subjectMarks, setSubjectMarks] = useState([]);
//     const [selectedSection, setSelectedSection] = useState('table');

//     useEffect(() => {
//         if (userDetails) {
//             setSubjectMarks(userDetails.examResult || []);
//         }
//     }, [userDetails])

//     useEffect(() => {
//         if (subjectMarks === []) {
//             dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
//         }
//     }, [subjectMarks, dispatch, currentUser.sclassName._id]);

//     const handleSectionChange = (event, newSection) => {
//         setSelectedSection(newSection);
//     };

//     const renderTableSection = () => {
//         return (
//             <>
//                 <Typography variant="h4" align="center" gutterBottom>
//                     Subject Marks
//                 </Typography>
//                 <Table>
//                     <TableHead>
//                         <StyledTableRow>
//                             <StyledTableCell>Subject</StyledTableCell>
//                             <StyledTableCell>Marks</StyledTableCell>
//                         </StyledTableRow>
//                     </TableHead>
//                     <TableBody>
//                         {subjectMarks.map((result, index) => {
//                             if (!result.subName || !result.marksObtained) {
//                                 return null;
//                             }
//                             return (
//                                 <StyledTableRow key={index}>
//                                     <StyledTableCell>{result.subName.subName}</StyledTableCell>
//                                     <StyledTableCell>{result.marksObtained}</StyledTableCell>
//                                 </StyledTableRow>
//                             );
//                         })}
//                     </TableBody>
//                 </Table>
//             </>
//         );
//     };

//     const renderChartSection = () => {
//         return <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />;
//     };

//     const renderClassDetailsSection = () => {
//         return (
//             <Container>
//                 <Typography variant="h4" align="center" gutterBottom>
//                     Class Details
//                 </Typography>
//                 <Typography variant="h5" gutterBottom>
//                     You are currently in Class {sclassDetails && sclassDetails.sclassName}
//                 </Typography>
//                 <Typography variant="h6" gutterBottom>
//                     And these are the subjects:
//                 </Typography>
//                 {subjectsList &&
//                     subjectsList.map((subject, index) => (
//                         <div key={index}>
//                             <Typography variant="subtitle1">
//                                 {subject.subName} ({subject.subCode})
//                             </Typography>
//                         </div>
//                     ))}
//             </Container>
//         );
//     };

//     return (
//         <>
//             {loading ? (
//                 <div>Loading...</div>
//             ) : (
//                 <div>
//                     {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
//                         ?
//                         (<>
//                             {selectedSection === 'table' && renderTableSection()}
//                             {selectedSection === 'chart' && renderChartSection()}

//                             <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
//                                 <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
//                                     <BottomNavigationAction
//                                         label="Table"
//                                         value="table"
//                                         icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
//                                     />
//                                     <BottomNavigationAction
//                                         label="Chart"
//                                         value="chart"
//                                         icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
//                                     />
//                                 </BottomNavigation>
//                             </Paper>
//                         </>)
//                         :
//                         (<>
//                             {renderClassDetailsSection()}
//                         </>)
//                     }
//                 </div>
//             )}
//         </>
//     );
// };

// export default StudentSubjects;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { getUserDetails } from '../../redux/userRelated/userHandle';

import {
  Card,
  CardContent,
  Container,
  Typography,
  LinearProgress,
  Box,
  Grid,
  Divider,
} from '@mui/material';

const StudentSubjects = () => {
  const dispatch = useDispatch();
  const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
  const { userDetails, currentUser, loading } = useSelector((state) => state.user);

  const [subjectMarks, setSubjectMarks] = useState([]);

  useEffect(() => {
    dispatch(getUserDetails(currentUser._id, 'Student'));
  }, [dispatch, currentUser._id]);

  useEffect(() => {
    if (userDetails) {
      setSubjectMarks(userDetails.examResult || []);
    }
  }, [userDetails]);

  useEffect(() => {
    if (subjectMarks.length === 0) {
      dispatch(getSubjectList(currentUser.sclassName._id, 'ClassSubjects'));
    }
  }, [subjectMarks, dispatch, currentUser.sclassName._id]);

  const getColor = (marks) => {
    if (marks >= 75) return 'success';
    if (marks >= 50) return 'warning';
    return 'error';
  };

  // Array of gradient colors for cards
  const cardColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  ];

  return (
    <PageWrapper>
      {/* HEADER */}
      <Header>
        <Typography variant="h4" fontWeight="bold" color="white">
          My Subjects
        </Typography>
      </Header>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {loading ? (
          <Typography align="center">Loading...</Typography>
        ) : subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
          <>
            {/* SUBJECT CARDS */}
            <Grid container spacing={3}>
              {subjectMarks.map((result, index) =>
                result.subName && result.marksObtained ? (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        boxShadow: 4,
                        p: 2,
                        background: cardColors[index % cardColors.length],
                        color: 'white',
                        transition: 'all 0.3s ease-in-out',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 12px 25px rgba(0,0,0,0.25)',
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold">
                          {result.subName.subName}
                        </Typography>
                        <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.4)' }} />
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body1">Marks</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {result.marksObtained} / 100
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={result.marksObtained}
                          color={getColor(result.marksObtained)}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            background: 'rgba(255,255,255,0.3)',
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ) : null
              )}
            </Grid>
          </>
        ) : (
          // CLASS DETAILS SECTION
          <Card sx={{ borderRadius: 3, boxShadow: 4, p: 3, mt: 4 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                📚 Class Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                You are currently in Class <b>{sclassDetails && sclassDetails.sclassName}</b>
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Subjects offered in this class:
              </Typography>
              {subjectsList &&
                subjectsList.map((subject, index) => (
                  <Typography key={index} variant="body1" sx={{ pl: 1, mb: 0.5 }}>
                    • {subject.subName} ({subject.subCode})
                  </Typography>
                ))}
            </CardContent>
          </Card>
        )}
      </Container>
    </PageWrapper>
  );
};

export default StudentSubjects;

// WRAPPER
const PageWrapper = ({ children }) => (
  <div
    style={{
      background: '#f5f6fa',
      minHeight: '100vh',
    }}
  >
    {children}
  </div>
);

// HEADER
const Header = ({ children }) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      padding: '50px 20px',
      textAlign: 'center',
      borderBottomLeftRadius: '50px',
      borderBottomRightRadius: '50px',
      boxShadow: '0px 4px 15px rgba(0,0,0,0.25)',
    }}
  >
    {children}
  </div>
);
