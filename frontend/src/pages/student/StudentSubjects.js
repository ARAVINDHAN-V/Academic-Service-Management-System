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
      <Header>
        <Typography variant="h4" fontWeight="bold" color="white">
          My Subjects
        </Typography>
      </Header>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {loading ? (
          <Typography align="center">Loading...</Typography>
        ) : subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
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
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 12px 25px rgba(0,0,0,0.25)',
                      },
                    }}
                  >
                    <CardContent>

                      {/* SUBJECT NAME */}
                      <Typography variant="h6" fontWeight="bold">
                        {result.subName.subName}
                      </Typography>

                      <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.4)' }} />

                      {/* MARKS */}
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Marks</Typography>
                        <Typography fontWeight="bold">
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

                      {/* ✅ AI FEEDBACK (ADDED HERE) */}
                      {result.suggestion && (
                        <Box
                          mt={2}
                          p={1.5}
                          sx={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            🤖 AI Feedback
                          </Typography>

                          <Typography variant="body2">
                            <b>Performance:</b> {result.suggestion.performance}
                          </Typography>

                          <Typography variant="body2">
                            <b>Advice:</b> {result.suggestion.advice}
                          </Typography>

                          <Typography variant="body2">
                            <b>Note:</b> {result.suggestion.attendanceMsg}
                          </Typography>
                        </Box>
                      )}

                    </CardContent>
                  </Card>
                </Grid>
              ) : null
            )}
          </Grid>
        ) : (
          <Card sx={{ borderRadius: 3, boxShadow: 4, p: 3, mt: 4 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                📚 Class Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="h6">
                You are in Class <b>{sclassDetails && sclassDetails.sclassName}</b>
              </Typography>

              {subjectsList &&
                subjectsList.map((subject, index) => (
                  <Typography key={index}>
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

/* WRAPPER */
const PageWrapper = ({ children }) => (
  <div style={{ background: '#f5f6fa', minHeight: '100vh' }}>
    {children}
  </div>
);

/* HEADER */
const Header = ({ children }) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      padding: '50px 20px',
      textAlign: 'center',
      borderBottomLeftRadius: '50px',
      borderBottomRightRadius: '50px',
    }}
  >
    {children}
  </div>
);