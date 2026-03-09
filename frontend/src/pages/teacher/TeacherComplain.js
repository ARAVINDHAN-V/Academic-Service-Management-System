// import React from 'react'

// const TeacherComplain = () => {
//   return (
//     <div>TeacherComplain</div>
//   )
// }

// export default TeacherComplain
import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, Divider } from '@mui/material';

const TeacherComplain = () => {
  // Dummy complaints (for now, you can replace with real data later)
  const complaints = [
    {
      id: 1,
      student: "John Doe",
      subject: "Classroom Discipline",
      details: "Teacher was strict about assignment deadlines.",
      date: "2025-09-10"
    },
    {
      id: 2,
      student: "Jane Smith",
      subject: "Teaching Style",
      details: "Felt the lecture pace was too fast.",
      date: "2025-09-11"
    }
  ];

  return (
    <Wrapper>
      <PageTitle variant="h4">Student Complaints</PageTitle>
      <Subtitle variant="body2">
        Here are the complaints you have received from students.
      </Subtitle>

      <ComplaintList>
        {complaints.map((complain) => (
          <ComplaintCard key={complain.id}>
            <CardContent>
              <Header>
                <Typography variant="h6">{complain.subject}</Typography>
                <DateText>{complain.date}</DateText>
              </Header>
              <Divider />
              <Details>{complain.details}</Details>
              <Footer>Submitted by: {complain.student}</Footer>
            </CardContent>
          </ComplaintCard>
        ))}
      </ComplaintList>
    </Wrapper>
  );
};

export default TeacherComplain;

// Styled Components
const Wrapper = styled.div`
  padding: 40px;
  background: #f5f6fa;
  min-height: 100vh;
`;

const PageTitle = styled(Typography)`
  font-weight: bold;
  margin-bottom: 8px;
`;

const Subtitle = styled(Typography)`
  color: #555;
  margin-bottom: 24px;
`;

const ComplaintList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ComplaintCard = styled(Card)`
  border-radius: 16px !important;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-4px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const DateText = styled(Typography)`
  font-size: 0.85rem;
  color: gray;
`;

const Details = styled(Typography)`
  margin: 16px 0;
  color: #333;
`;

const Footer = styled(Typography)`
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
`;
