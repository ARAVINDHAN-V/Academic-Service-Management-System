import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ IMPORTANT

import {
    Paper, Box, IconButton
} from '@mui/material';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";

import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';

import TableTemplate from '../../../components/TableTemplate';
import { GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowNotices = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    // ✅ DELETE FUNCTION (FIXED)
    const deleteHandler = async (deleteID, address) => {
        try {
            if (!window.confirm("Are you sure you want to delete?")) return;

            await axios.delete(`http://localhost:5000/${address}/${deleteID}`);

            setMessage("✅ Deleted successfully");
            setShowPopup(true);

            // 🔄 Refresh list
            dispatch(getAllNotices(currentUser._id, "Notice"));

        } catch (err) {
            console.log(err);
            setMessage("❌ Delete failed");
            setShowPopup(true);
        }
    };

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const noticeRows = noticesList && noticesList.length > 0 && noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString =
            date.toString() !== "Invalid Date"
                ? date.toISOString().substring(0, 10)
                : "Invalid Date";

        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    });

    // ✅ Delete button per row
    const NoticeButtonHaver = ({ row }) => {
        return (
            <IconButton onClick={() => deleteHandler(row.id, "Notice")}>
                <DeleteIcon color="error" />
            </IconButton>
        );
    };

    // ✅ Floating actions
    const actions = [
        {
            icon: <NoteAddIcon color="primary" />,
            name: 'Add New Notice',
            action: () => navigate("/Admin/addnotice")
        },
        {
            icon: <DeleteIcon color="error" />,
            name: 'Delete All Notices',
            action: () => deleteHandler(currentUser._id, "Notices")
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
                {/* ✅ NO DATA UI */}
                {Array.isArray(noticesList) && noticesList.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: "center",
                            mt: 10,
                            color: "#555"
                        }}
                    >
                        <h2>📭 No Notices Available</h2>
                        <p>Create a new notice to get started</p>

                        <GreenButton
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={() => navigate("/Admin/addnotice")}
                        >
                            Add Notice
                        </GreenButton>
                    </Box>
                ) : (
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableTemplate
                            buttonHaver={NoticeButtonHaver}
                            columns={noticeColumns}
                            rows={noticeRows}
                        />
                        <SpeedDialTemplate actions={actions} />
                    </Paper>
                )}
            </>
        )}

        {/* ✅ Popup */}
        <Popup
            message={message}
            setShowPopup={setShowPopup}
            showPopup={showPopup}
        />
    </>
);
};

export default ShowNotices;