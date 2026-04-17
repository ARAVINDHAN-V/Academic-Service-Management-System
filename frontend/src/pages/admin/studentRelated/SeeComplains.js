import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Box, Typography, MenuItem, Select,
  TextField, Button, CircularProgress
} from '@mui/material';

const SeeComplains = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get(`http://localhost:5000/ComplainList/${user._id}`)
      .then(res => {
        setComplaints(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleUpdate = (id, status, response) => {
    axios.put(`http://localhost:5000/Complain/${id}`, {
      status,
      adminResponse: response
    })
      .then(() => {
        alert("Updated successfully");
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <h2>📭 No Complaints Available</h2>
        <p>All good! No issues reported.</p>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>All Complaints</Typography>

      {complaints.map((c) => {
        let selectedStatus = c.status;
        let responseText = c.adminResponse || "";

        return (
          <Paper key={c._id} sx={{ p: 3, mb: 2 }}>
            <Typography><b>User:</b> {c.user?.name}</Typography>
            <Typography><b>Date:</b> {new Date(c.date).toISOString().substring(0, 10)}</Typography>
            <Typography><b>Complaint:</b> {c.complaint}</Typography>
            <Typography><b>Status:</b> {c.status}</Typography>

            {/* STATUS SELECT */}
            <Select
              fullWidth
              defaultValue={c.status}
              sx={{ mt: 2 }}
              onChange={(e) => selectedStatus = e.target.value}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>

            {/* ADMIN RESPONSE */}
            <TextField
              fullWidth
              placeholder="Write response..."
              sx={{ mt: 2 }}
              defaultValue={c.adminResponse}
              onChange={(e) => responseText = e.target.value}
            />

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => handleUpdate(c._id, selectedStatus, responseText)}
            >
              Update
            </Button>
          </Paper>
        );
      })}
    </Box>
  );
};

export default SeeComplains;