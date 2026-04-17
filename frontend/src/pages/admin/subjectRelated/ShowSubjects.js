import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
// import { deleteUser } from '../../../redux/userRelated/userHandle';
import axios from "axios";
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, IconButton,
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowSubjects = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

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
    const subjectColumns = [
        { id: 'subName', label: 'Sub Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 170 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    const subjectRows = subjectsList.map((subject) => {
        return {
            subName: subject.subName,
            sessions: subject.sessions,
            sclassName: subject.sclassName.sclassName,
            sclassID: subject.sclassName._id,
            id: subject._id,
        };
    })

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)}>
                    View
                </BlueButton>
            </>
        );
    };

    const actions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/subjects/chooseclass")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(currentUser._id, "Subjects")
        }
    ];

    return (
    <>
        {loading ? (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                Loading...
            </div>
        ) : (
            <>
                {Array.isArray(subjectsList) && subjectsList.length === 0 ? (
                    <Box sx={{ textAlign: "center", mt: 10 }}>
                        <h2>📚 No Subjects Added</h2>
                        <p>Create subjects to continue</p>

                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/subjects/chooseclass")}
                        >
                            Add Subject
                        </GreenButton>
                    </Box>
                ) : (
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableTemplate
                            buttonHaver={SubjectsButtonHaver}
                            columns={subjectColumns}
                            rows={subjectRows}
                        />
                        <SpeedDialTemplate actions={actions} />
                    </Paper>
                )}
            </>
        )}

        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
);
};

export default ShowSubjects;