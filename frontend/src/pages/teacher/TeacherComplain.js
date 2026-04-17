import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, TextField, Stack, CircularProgress
} from '@mui/material';
import { BlueButton } from '../../components/buttonStyles';

const TeacherComplain = () => {
  const userData = JSON.parse(localStorage.getItem("user"));

  const [complaint, setComplaint] = useState("");
  const [date, setDate] = useState("");
  const [loader, setLoader] = useState(false);
  const [myComplaints, setMyComplaints] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoader(true);

    axios.post("http://localhost:5000/ComplainCreate", {
      user: userData._id,
      date,
      complaint,
      school: userData.school._id
    })
      .then(() => {
        alert("Complaint submitted");
        setLoader(false);
        setComplaint("");
        setDate("");
        fetchComplaints();
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  const fetchComplaints = () => {
    axios.get(`http://localhost:5000/ComplainList/${userData.school._id}`)
      .then(res => {
        const mine = res.data.filter(c => c.user._id === userData._id);
        setMyComplaints(mine);
      });
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4">Teacher Complaint</Typography>

      <form onSubmit={submitHandler}>
        <Stack spacing={2} mt={2}>
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <TextField
            label="Complaint"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            multiline
            rows={3}
            required
          />

          <BlueButton type="submit" disabled={loader}>
            {loader ? <CircularProgress size={24} /> : "Submit"}
          </BlueButton>
        </Stack>
      </form>

      <Typography variant="h5" mt={5}>My Complaints</Typography>

      {myComplaints.map((c) => (
        <Box key={c._id} sx={{ mt: 2, p: 2, border: "1px solid #ccc" }}>
          <Typography>{c.complaint}</Typography>
          <Typography>Status: <b>{c.status}</b></Typography>
          <Typography>
            Admin Response: {c.adminResponse || "No response yet"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TeacherComplain;