import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import axios from "axios";
import {
    Paper, Table, TableBody, TableContainer,
    TableHead, TablePagination, Button, Box, IconButton,
} from '@mui/material';
// import { deleteUser } from '../../../redux/userRelated/userHandle';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    if (loading) {
        return <div>Loading...</div>;
    } else if (response) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <GreenButton variant="contained" onClick={() => navigate("/Admin/teachers/chooseclass")}>
                    Add Teacher
                </GreenButton>
            </Box>
        );
    } else if (error) {
        console.log(error);
    }

    const deleteHandler = async (deleteID, address) => {
    try {
        await axios.delete(`http://localhost:5000/${address}/${deleteID}`);

        setMessage("✅ Deleted successfully");
        setShowPopup(true);

        // OPTIONAL: refresh page
        window.location.reload();

    } catch (error) {
        console.log(error);
        setMessage("❌ Delete failed");
        setShowPopup(true);
    }
};

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Subject', minWidth: 100 },
        { id: 'teachSclass', label: 'Class', minWidth: 170 },
    ];

    const rows = teachersList.map((teacher) => {
        return {
            name: teacher.name,
            teachSubject: teacher.teachSubject?.subName || null,
            teachSclass: teacher.teachSclass.sclassName,
            teachSclassID: teacher.teachSclass._id,
            id: teacher._id,
        };
    });

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Teacher',
            action: () => navigate("/Admin/teachers/chooseclass")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Teachers',
            action: () => deleteHandler(currentUser._id, "Teachers")
        },
    ];

 return (
  <>
    {loading ? (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>

    ) : !teachersList || teachersList.length === 0 ? (
      // ✅ SAFE EMPTY CHECK
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <h2>👨‍🏫 No Teachers Available</h2>
        <p>Add teachers to manage classes</p>

        <GreenButton
          variant="contained"
          onClick={() => navigate("/Admin/teachers/chooseclass")}
        >
          Add Teacher
        </GreenButton>
      </Box>

    ) : (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <StyledTableRow>
                {columns.map((column) => (
                  <StyledTableCell key={column.id}>
                    {column.label}
                  </StyledTableCell>
                ))}
                <StyledTableCell align="center">
                  Actions
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StyledTableRow key={row.id} hover>
                    {columns.map((column) => {
                      const value = row[column.id];

                      if (column.id === 'teachSubject') {
                        return (
                          <StyledTableCell key={column.id}>
                            {value ? value : (
                              <Button
                                variant="contained"
                                onClick={() =>
                                  navigate(`/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`)
                                }
                              >
                                Add Subject
                              </Button>
                            )}
                          </StyledTableCell>
                        );
                      }

                      return (
                        <StyledTableCell key={column.id}>
                          {value}
                        </StyledTableCell>
                      );
                    })}

                    <StyledTableCell align="center">
                      <IconButton onClick={() => deleteHandler(row.id, "Teacher")}>
                        <PersonRemoveIcon color="error" />
                      </IconButton>

                      <BlueButton
                        variant="contained"
                        onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}
                      >
                        View
                      </BlueButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />

        <SpeedDialTemplate actions={actions} />
      </Paper>
    )}

    <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
  </>
);
};

export default ShowTeachers