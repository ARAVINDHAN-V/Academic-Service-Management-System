// import React from 'react'
// import styled from 'styled-components';
// import { Card, CardContent, Typography, Grid, Box, Avatar, Container, Paper } from '@mui/material';
// import { useSelector } from 'react-redux';

// const StudentProfile = () => {
//   const { currentUser, response, error } = useSelector((state) => state.user);

//   if (response) { console.log(response) }
//   else if (error) { console.log(error) }

//   const sclassName = currentUser.sclassName
//   const studentSchool = currentUser.school

//   return (
//     <>
//       <Container maxWidth="md">
//         <StyledPaper elevation={3}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Box display="flex" justifyContent="center">
//                 <Avatar alt="Student Avatar" sx={{ width: 150, height: 150 }}>
//                   {String(currentUser.name).charAt(0)}
//                 </Avatar>
//               </Box>
//             </Grid>
//             <Grid item xs={12}>
//               <Box display="flex" justifyContent="center">
//                 <Typography variant="h5" component="h2" textAlign="center">
//                   {currentUser.name}
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={12}>
//               <Box display="flex" justifyContent="center">
//                 <Typography variant="subtitle1" component="p" textAlign="center">
//                   Student Roll No: {currentUser.rollNum}
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={12}>
//               <Box display="flex" justifyContent="center">
//                 <Typography variant="subtitle1" component="p" textAlign="center">
//                   Class: {sclassName.sclassName}
//                 </Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={12}>
//               <Box display="flex" justifyContent="center">
//                 <Typography variant="subtitle1" component="p" textAlign="center">
//                   School: {studentSchool.schoolName}
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//         </StyledPaper>
//         <Card>
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               Personal Information
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" component="p">
//                   <strong>Date of Birth:</strong> January 1, 2004
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" component="p">
//                   <strong>Gender:</strong> Male
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" component="p">
//                   <strong>Email:</strong> bob@gmail.com
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" component="p">
//                   <strong>Phone:</strong> 9876543210
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" component="p">
//                   <strong>Address:</strong> Alathukombai, Sathyamangalam, Erode
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle1" component="p">
//                   <strong>Emergency Contact:</strong> 108
//                 </Typography>
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>
//       </Container>
//     </>
//   )
// }

// export default StudentProfile

// const StyledPaper = styled(Paper)`
//   padding: 20px;
//   margin-bottom: 20px;
// `;

import React from 'react';
import styled from 'styled-components';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Container,
  Paper,
  Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import HomeIcon from '@mui/icons-material/Home';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) console.log(response);
  else if (error) console.log(error);

  const sclassName = currentUser.sclassName;
  const studentSchool = currentUser.school;

  return (
    <PageWrapper>
      {/* Header Section */}
      <Header>
        <Avatar
          alt="Student Avatar"
          sx={{
            width: 110,
            height: 110,
            fontSize: '1.8rem',
            bgcolor: '#ffffff33',
            color: 'white',
            mb: 1.5,
          }}
        >
          {String(currentUser.name).charAt(0)}
        </Avatar>
        <Typography variant="h5" fontWeight="bold" color="white">
          {currentUser.name}
        </Typography>
        <Typography variant="subtitle2" color="white">
          Roll No: {currentUser.rollNum}
        </Typography>
      </Header>

      {/* Class / School Section */}
      <Container maxWidth="sm" sx={{ mt: -5 }}>
        <StyledPaper elevation={4}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={6}>
              <InfoBox>
                <Typography variant="subtitle2" color="textSecondary">
                  Class
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {sclassName.sclassName}
                </Typography>
              </InfoBox>
            </Grid>
            <Grid item xs={6}>
              <InfoBox>
                <Typography variant="subtitle2" color="textSecondary">
                  School
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {studentSchool.schoolName}
                </Typography>
              </InfoBox>
            </Grid>
          </Grid>
        </StyledPaper>
      </Container>

      {/* Personal Information */}
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            mt: 3,
            overflow: 'hidden',
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoField>
                  <CakeIcon className="icon" />
                  <span>
                    <strong>Date of Birth:</strong> January 5, 2004
                  </span>
                </InfoField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField>
                  <WcIcon className="icon" />
                  <span>
                    <strong>Gender:</strong> Male
                  </span>
                </InfoField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField>
                  <EmailIcon className="icon" />
                  <span>
                    <strong>Email:</strong> mehan.bitsathy.ac.in
                  </span>
                </InfoField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField>
                  <PhoneIcon className="icon" />
                  <span>
                    <strong>Phone:</strong> 9876543210
                  </span>
                </InfoField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField>
                  <HomeIcon className="icon" />
                  <span>
                    <strong>Address:</strong> Alathukombai, Sathyamangalam, Erode
                  </span>
                </InfoField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField>
                  <ContactEmergencyIcon className="icon" />
                  <span>
                    <strong>Emergency Contact:</strong> 108
                  </span>
                </InfoField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default StudentProfile;

/* 🌈 Styled Components */

// Page Background
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

// Header with Gradient (smaller height)
const Header = ({ children }) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      padding: '30px 20px 60px', // reduced height
      textAlign: 'center',
      borderBottomLeftRadius: '30px',
      borderBottomRightRadius: '30px',
      boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
    }}
  >
    {children}
  </div>
);

// Class / School container
const StyledPaper = styled(Paper)`
  padding: 20px;
  border-radius: 16px !important;
  margin: -30px auto 20px auto; /* overlaps header */
  text-align: center;
  background: white;
`;

// Info Boxes (Class & School)
const InfoBox = styled(Box)`
  background: #f0f2ff;
  border-radius: 14px;
  padding: 18px;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: #e0e4ff;
    transform: translateY(-4px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

// Info Fields with icons
const InfoField = styled(Typography)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background: #fafafa;
  transition: all 0.2s;
  .icon {
    color: #6a11cb;
  }
  &:hover {
    background: #f0f0f0;
  }
`;
