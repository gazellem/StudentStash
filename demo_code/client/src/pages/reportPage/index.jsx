import React, { useEffect, useState } from "react";
import {useNavigate, useParams, Link} from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab
} from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {setUser} from "../../state";
import Navbar from "pages/navbar";
import ChatWidget from "../widgets/ChatWidget";
import AddIcon from "@mui/icons-material/Add";
import CreateListingWidget from "../widgets/CreateListingWidget";


const ListingPage = () => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    const dispatch = useDispatch();
    const { reportId } = useParams(); // Get the listing ID from URL
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({flatType: '', title: '', description: '', endDate: '' ,type: '',rentPrice: '',price:'',condition:'',place:'',date:'',activityCapacity:''});
    const token = useSelector((state) => state.token);
    const {_id} = useSelector((state) => state.user);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchListing = async () => {
            try {
                const response = await fetch(`http://localhost:3500/reports/${reportId}`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}`},
                    }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data = await response.json();
                setReport(data);

            } catch (error) {
                console.error("Error fetching listing:", error);
                // Handle errors appropriately
            } finally {
                setIsLoading(false);
            }
        };

        fetchListing();
    }, [user,reportId]);


    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!report) {
        return <p>Listing not found.</p>;
    }
    const renderReportDetails = () => {
        if(!report)
            return <p>loading</p>
        else{
                return(
                    <>
                        <Typography variant="body1" align="center" gutterBottom>Date: </Typography>
                        <Typography variant="body1" align="center" gutterBottom>Place: </Typography>
                    </>
                );
            // Add cases for other listing types

        }
    };

    const returnToHome = () =>
    {
        navigate('/home')
    }


    const handleDeleteReport = async () => {
        try {
            const response = await fetch(`http://localhost:3500/reports/delete/${reportId}`,
                {
                    method: "DELETE",
                    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                }
            );
            navigate('/home')
        } catch (error) {
            console.error("Error fetching: ", error);
            // Handle errors appropriately
        }
        navigate('/home')
    };


        return (
            <Box>
                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <Paper elevation={3} style={{ padding: '20px', width: '100%', maxWidth: '1000px' }}>
                        <Typography variant="h2" align="center" gutterBottom>{report.reported_user.username}</Typography>
                        {user && (
                            <Box textAlign="center">
                                <Link to={`/profile/${report.reported_user.username}`} style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}>
                                    <Button variant="outlined" color="primary" size="small">
                                        View Profile
                                    </Button>
                                </Link>
                            </Box>
                        )}
                        <Divider style={{ margin: '20px 0' }} />
                        <Typography variant="body1" align="center" gutterBottom>{report.description}</Typography>
                        <Divider style={{ margin: '20px 0' }} />
                        <Box mt={2} textAlign="center">
                            <Button variant="contained" color="primary" onClick={handleDeleteReport} >
                                Delete Report
                            </Button>
                            <div style={{textAlign: 'center', marginTop: '1rem'}}>
                                <Button variant="contained" color="primary" onClick={returnToHome}>
                                   Return to Home
                                </Button>
                            </div>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        );

};

export default ListingPage;