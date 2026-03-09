import React, { useEffect } from "react";
import { getTeacherDetails } from "../../../redux/teacherRelated/teacherHandle";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import BookIcon from "@mui/icons-material/Book";

const TeacherDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

  const teacherID = params.id;

  useEffect(() => {
    dispatch(getTeacherDetails(teacherID));
  }, [dispatch, teacherID]);

  if (error) {
    console.log(error);
  }

  const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

  const handleAddSubject = () => {
    navigate(
      `/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`
    );
  };

  return (
    <Container sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        <Card
          sx={{
            maxWidth: 600,
            width: "100%",
            borderRadius: 4,
            boxShadow: 5,
            p: 3,
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 90,
                height: 90,
                fontSize: "2rem",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              {teacherDetails?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {teacherDetails?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Teacher Profile
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <ClassIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Class
                    </Typography>
                    <Typography variant="subtitle1">
                      {teacherDetails?.teachSclass?.sclassName || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {isSubjectNamePresent && (
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BookIcon color="secondary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Subject
                      </Typography>
                      <Typography variant="subtitle1">
                        {teacherDetails?.teachSubject?.subName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {isSubjectNamePresent && (
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <SchoolIcon color="success" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Sessions
                      </Typography>
                      <Typography variant="subtitle1">
                        {teacherDetails?.teachSubject?.sessions}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>

            {!isSubjectNamePresent && (
              <Box textAlign="center" mt={4}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No subject assigned yet.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    background: "linear-gradient(135deg, #2e7d32, #66bb6a)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1b5e20, #388e3c)",
                    },
                  }}
                  onClick={handleAddSubject}
                >
                  ➕ Assign Subject
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default TeacherDetails;






// import React, { useEffect } from 'react';
// import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button, Container, Typography } from '@mui/material';

// const TeacherDetails = () => {
//     const navigate = useNavigate();
//     const params = useParams();
//     const dispatch = useDispatch();
//     const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

//     const teacherID = params.id;

//     useEffect(() => {
//         dispatch(getTeacherDetails(teacherID));
//     }, [dispatch, teacherID]);

//     if (error) {
//         console.log(error);
//     }

//     const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

//     const handleAddSubject = () => {
//         navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
//     };

//     return (
//         <>
//             {loading ? (
//                 <div>Loading...</div>
//             ) : (
//                 <Container>
//                     <Typography variant="h4" align="center" gutterBottom>
//                         Teacher Details
//                     </Typography>
//                     <Typography variant="h6" gutterBottom>
//                         Teacher Name: {teacherDetails?.name}
//                     </Typography>
//                     <Typography variant="h6" gutterBottom>
//                         Class Name: {teacherDetails?.teachSclass?.sclassName}
//                     </Typography>
//                     {isSubjectNamePresent ? (
//                         <>
//                             <Typography variant="h6" gutterBottom>
//                                 Subject Name: {teacherDetails?.teachSubject?.subName}
//                             </Typography>
//                             <Typography variant="h6" gutterBottom>
//                                 Subject Sessions: {teacherDetails?.teachSubject?.sessions}
//                             </Typography>
//                         </>
//                     ) : (
//                         <Button variant="contained" onClick={handleAddSubject}>
//                             Add Subject
//                         </Button>
//                     )}
//                 </Container>
//             )}
//         </>
//     );
// };

// export default TeacherDetails;