// import React from 'react'
// import styled from 'styled-components';
// import { Card, CardContent, Typography } from '@mui/material';
// import { useSelector } from 'react-redux';

// const TeacherProfile = () => {
//   const { currentUser, response, error } = useSelector((state) => state.user);

//   if (response) { console.log(response) }
//   else if (error) { console.log(error) }

//   const teachSclass = currentUser.teachSclass
//   const teachSubject = currentUser.teachSubject
//   const teachSchool = currentUser.school

//   return (
//     <>
//       <ProfileCard>
//         <ProfileCardContent>
//           <ProfileText>Name: {currentUser.name}</ProfileText>
//           <ProfileText>Email: {currentUser.email}</ProfileText>
//           <ProfileText>Class: {teachSclass.sclassName}</ProfileText>
//           <ProfileText>Subject: {teachSubject.subName}</ProfileText>
//           <ProfileText>School: {teachSchool.schoolName}</ProfileText>
//         </ProfileCardContent>
//       </ProfileCard>
//     </>
//   )
// }

// export default TeacherProfile

// const ProfileCard = styled(Card)`
//   margin: 20px;
//   width: 400px;
//   border-radius: 10px;
// `;

// const ProfileCardContent = styled(CardContent)`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const ProfileText = styled(Typography)`
//   margin: 10px;
// `;

import React from 'react'
import styled from 'styled-components';
import { Card, CardContent, Typography, Avatar, Divider } from '@mui/material';
import { useSelector } from 'react-redux';

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) console.log(response);
  else if (error) console.log(error);

  const teachSclass = currentUser.teachSclass;
  const teachSubject = currentUser.teachSubject;
  const teachSchool = currentUser.school;

  // Avatar initials
  const initials = currentUser.name
    ? currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "?";

  return (
    <ProfileCard>
      <ProfileHeader>
        <ProfileAvatar>{initials}</ProfileAvatar>
        <Typography variant="h5" fontWeight="bold">
          {currentUser.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentUser.email}
        </Typography>
      </ProfileHeader>

      <Divider />

      <ProfileCardContent>
        <InfoRow>
          <Label>Class:</Label>
          <Value>{teachSclass.sclassName}</Value>
        </InfoRow>
        <InfoRow>
          <Label>Subject:</Label>
          <Value>{teachSubject.subName}</Value>
        </InfoRow>
        <InfoRow>
          <Label>School:</Label>
          <Value>{teachSchool.schoolName}</Value>
        </InfoRow>
      </ProfileCardContent>
    </ProfileCard>
  )
}

export default TeacherProfile;

// Styled Components
const ProfileCard = styled(Card)`
  margin: 30px auto;
  width: 420px;
  border-radius: 16px !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #31cf71ff 0%, #2575fc 100%);
  color: white;
`;

const ProfileAvatar = styled(Avatar)`
  && {
    background-color: #ffffff44;
    color: white;
    font-weight: bold;
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
    margin-bottom: 12px;
  }
`;

const ProfileCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  padding: 24px !important;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
`;

const Label = styled(Typography).attrs({
  variant: "body1",
  fontWeight: "bold"
})``;

const Value = styled(Typography).attrs({
  variant: "body1",
  color: "text.secondary"
})``;
