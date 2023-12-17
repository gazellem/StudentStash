import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Fab,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUser } from "../../state";
import Navbar from "pages/navbar";
import ChatWidget from "../widgets/ChatWidget";
import PostsWidget from "pages/widgets/PostsWidget";
import PostWidget from "../widgets/PostWidget";
import AddIcon from "@mui/icons-material/Add";
import CreateListingWidget from "../widgets/CreateListingWidget";
import UserWidget from "../widgets/UserWidget";

const ProfilePage = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate()
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showingSavedListings, setSaved] = useState(0);
    const [ownListings, setOwnListings] = useState([]);
    const [savedListings, setSavedListings] = useState([]);
    const { username } = useParams();
    const token = useSelector((state) => state.token);
    const loggedUser = useSelector((state) => state.user);
    const [editData, setEditData] = useState({password: ''});
    const [editReportData, setEditReportData] = useState({description: ''})
    const [isBlocked, setBlocked] = useState(false)
    useEffect(() => {
        const getUserByName = async () => {
            const response = await fetch(`http://localhost:3500/users/get/${username}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setUser(data);
            // console.log(data.username)
            // checkIfUserIsBlocked(data);
        };

        const checkIfUserIsBlocked = (userData) => {
            console.log(loggedUser.blockedUsers)
            console.log(userData.username)
            const isUserBlocked = loggedUser.blockedUsers.some(blockedId => blockedId === userData._id);
            console.log(isUserBlocked)
            setBlocked(isUserBlocked);
        }

        getUserByName();
    }, [username, loggedUser, token, navigate]); // eslint-disable-line react-hooks/exhaustive-deps



    useEffect(() => {
        // Fetch own listings if viewing own profile
        const fetchOwnListings = async () => {
            // Replace with actual endpoint to fetch user's own listings
            const response = await fetch(`http://localhost:3500/users/get/${username}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const userData = await response.json();
            userData.ownListings.reverse()
            setOwnListings(userData.ownListings);
        };
        fetchOwnListings();

    }, [user, loggedUser, token]);

    useEffect(() => {
        // Fetch own listings if viewing own profile
        const fetchSavedListings = async () => {
            // Replace with actual endpoint to fetch user's own listings
            const response = await fetch(`http://localhost:3500/users/get/${username}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const userData = await response.json();
            setSavedListings(userData.savedListings);
        };
        fetchSavedListings();

    }, [user, loggedUser, token]);

    const handleEditChange = (e) => {
        setEditData({...editData,[e.target.name]: e.target.value})

    };

    const handleReportEditChange = (e) => {
        setEditReportData({...editReportData,[e.target.name]: e.target.value})

    };


    const handleEditSave = async() =>{
        const passwordObj = {password: editData.password, username: user.username}
        const response = await fetch(`http://localhost:3500/users/change-password/`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(passwordObj)
            }
        );
        setIsEditing(false)
    };

    const handleReportEditSave = async() =>{
        const reportObj = {description: editReportData.description, reporter_username: loggedUser.username, reported_username: user.username}
        const response = await fetch(`http://localhost:3500/reports/create/`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(reportObj)
            }
        );
        setIsEditing(false)
    };
    const handleBlock = async() => {
        console.log("in profile block")
        const obj = {blocker_username: loggedUser.username, blocked_username: user.username}
        console.log(obj)
        const response = await fetch(`http://localhost:3500/users/block/`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(obj)
            }
        );
    }

    const handleWarn = async() => {
        const obj = {username: user.username}
        const response = await fetch("http://localhost:3500/users/warn/",
            {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(obj)
            }

        );
    }

    const handleBan = async() => {
        const obj = {username: user.username}
        const response = await fetch("http://localhost:3500/users/ban/",
            {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(obj)
            }

        );
    }

    const handleUnban = async() => {
        const obj = {username: user.username}
        const response = await fetch("http://localhost:3500/users/unban/",
            {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(obj)
            }

        );
    }


    const isOwnProfile = user && user.username === loggedUser.username;

    if (!user) return null;


    function renderListingButton() {
        if (showingSavedListings === 1) {
            return (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSaved(0)}
                    size="large"
                    sx={{
                        my: 1,
                        width: "100%",
                        "&:hover": {
                            backgroundColor: "#0069c0",
                        },
                    }}
                >
                    Your Listings
                </Button>
            );
        } else if(showingSavedListings === 0) {
            return (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSaved(1)}
                    size="large"
                    sx={{
                        my: 1,
                        width: "100%",
                        "&:hover": {
                            backgroundColor: "#0069c0",
                        },
                    }}
                >
                    Saved Listings
                </Button>
            );
        }
        else if(showingSavedListings === 2){
            return (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setSaved(1)}
                        size="large"
                        sx={{
                            my: 1,
                            width: "100%",
                            "&:hover": {
                                backgroundColor: "#0069c0",
                            },
                        }}
                    >
                        Saved Listings
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setSaved(0)}
                        size="large"
                        sx={{
                            my: 1,
                            width: "100%",
                            "&:hover": {
                                backgroundColor: "#0069c0",
                            },
                        }}
                    >
                        Your Listings
                    </Button>
                </>
            );
        }
    }
    const handleUnblock = async() => {
        console.log("in profile block")
        const obj = {username: loggedUser.username, blocked_username: user.username}
        console.log(obj)
        const response = await fetch(`http://localhost:3500/users/unblock/`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(obj)
            }
        );
    }

    function renderButtons() {
        if (isOwnProfile) {
            if(loggedUser.type === "User") {
                return (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsEditing(true)}
                            size="large"
                            sx={{
                                my: 1,
                                width: "100%",
                                "&:hover": {
                                    backgroundColor: "#0069c0",
                                },
                            }}
                        >
                            Change Password
                        </Button>
                        <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogContent>
                                <TextField
                                    margin="dense"
                                    label="New Password"
                                    type="text"
                                    fullWidth
                                    name="password"
                                    value={editData.password}
                                    onChange={handleEditChange}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setIsEditing(false)} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleEditSave} color="primary">
                                    Change
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {renderListingButton()}
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => setSaved(2)}
                            sx={{
                                my: 1,
                                width: "100%",
                                "&:hover": {
                                    backgroundColor: "#0069c0",
                                },
                            }}
                        >
                            Blocked Users
                        </Button>
                    </>
                );
            }
            else if(loggedUser.type === "Admin"){
                return(
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsEditing(true)}
                            size="large"
                            sx={{
                                my: 1,
                                width: "100%",
                                "&:hover": {
                                    backgroundColor: "#0069c0",
                                },
                            }}
                        >
                            Change Password
                        </Button>
                        <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogContent>
                                <TextField
                                    margin="dense"
                                    label="New Password"
                                    type="text"
                                    fullWidth
                                    name="password"
                                    value={editData.password}
                                    onChange={handleEditChange}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setIsEditing(false)} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleEditSave} color="primary">
                                    Change
                                </Button>
                            </DialogActions>
                        </Dialog>
                    < />
                );
            }
        } else {
            if(loggedUser.type === "User"){
                return (
                    <>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleBlock()}
                            size="large"
                            sx={{
                                my: 1,
                                width: "100%",
                                "&:hover": {
                                    backgroundColor: "#d32f2f",
                                },
                            }}
                        >
                            Block User
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleUnblock()}
                            size="large"
                            sx={{
                                my: 1,
                                width: "100%",
                                "&:hover": {
                                    backgroundColor: "#ff0000",
                                },
                            }}
                        >
                            Unblock User
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsEditing(true)}
                            size="large"
                            sx={{
                                my: 1,
                                width: "100%",
                                "&:hover": {
                                    backgroundColor: "#0069c0",
                                },
                            }}
                        >
                            Report User
                        </Button>
                        <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
                            <DialogTitle>Report User</DialogTitle>
                            <DialogContent>
                                <TextField
                                    margin="dense"
                                    label="Report description"
                                    type="text"
                                    fullWidth
                                    name="description"
                                    value={editData.description}
                                    onChange={handleReportEditChange}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setIsEditing(false)} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleReportEditSave} color="primary">
                                    Submit
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                );
            } else if(loggedUser.type === "Admin"){
                return (
                    <>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleWarn()}
                            size="large"
                            sx={{
                                my: 1,
                                width: "100%",
                                "&:hover": {
                                    backgroundColor: "#d32f2f",
                                },
                            }}
                        >
                            Warn User
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleBan()}
                            size="large"
                            sx={{
                                my: 1,
                                width: "100%",
                                "&:hover": {
                                    backgroundColor: "#ff0000",
                                },
                            }}
                        >
                            Ban User
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleUnban()}
                            size="large"
                            sx={{
                                my: 1,
                                width: "100%",
                                "&:hover": {
                                    backgroundColor: "#ff0000",
                                },
                            }}
                        >
                            Unban User
                        </Button>
                    </>

                );
            }

        }
    }

    function renderOwnListings() {
        if(isOwnProfile) {
            if(loggedUser.type === "Admin"){
                return(
                    <></>
                );
            }
            if(showingSavedListings === 1){
                return (
                    <Paper elevation={10} sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                        <Paper elevation={0} sx={{ mt: 0, padding: 3, maxWidth: 600, width: '100%' }}>
                            <Typography variant="h4" align="center">Saved Listings</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ mt: 2, mx: 'auto', width: '100%', maxWidth: 600 }}>
                                <Grid container spacing={2} justifyContent="center">
                                    {savedListings.map((listing) => (
                                        <Grid item key={listing._id} xs={6}>
                                            <Card elevation={3} sx={{ '&:hover': { boxShadow: 6 } }}>
                                                <CardContent>
                                                    <PostWidget listing={listing} />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Paper>
                    </Paper>
                )
            } else if (showingSavedListings === 0){
                return (
                    <Paper elevation={10} sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                        <Paper elevation={0} sx={{ mt: 0, padding: 3, maxWidth: 600, width: '100%' }}>
                            <Typography variant="h4" align="center">Your Listings</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ mt: 2, mx: 'auto', width: '100%', maxWidth: 600 }}>
                                <Grid container spacing={2} justifyContent="center">
                                    {ownListings.map((listing) => (
                                        <Grid item key={listing._id} xs={6}>
                                            <Card elevation={3} sx={{ '&:hover': { boxShadow: 6 } }}>
                                                <CardContent>
                                                    <PostWidget listing={listing} />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Paper>
                    </Paper>
                )
            }
            else if(showingSavedListings === 2){
                return (
                    <Paper elevation={10} sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                        <Paper elevation={0} sx={{ mt: 0, padding: 3, maxWidth: 600, width: '100%' }}>
                            <Typography variant="h4" align="center">Blocked Users</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ mt: 2, mx: 'auto', width: '100%', maxWidth: 600 }}>
                                <Grid container spacing={2} justifyContent="center">
                                    {user.blockedUsers.map((blockedUser) => (
                                        <Grid item key={blockedUser._id} xs={6}>
                                            <Card elevation={3} sx={{ '&:hover': { boxShadow: 6 } }}>
                                                <CardContent>
                                                    <UserWidget user={blockedUser} />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Paper>
                    </Paper>
                )
            }
        }
        else{
            return (
                <Paper elevation={10} sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                    <Paper elevation={0} sx={{ mt: 0, padding: 3, maxWidth: 600, width: '100%' }}>
                        <Typography variant="h4" align="center">Listings</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mt: 2, mx: 'auto', width: '100%', maxWidth: 600 }}>
                            <Grid container spacing={2} justifyContent="center">
                                {ownListings.map((listing) => (
                                    <Grid item key={listing._id} xs={6}>
                                        <Card elevation={3} sx={{ '&:hover': { boxShadow: 6 } }}>
                                            <CardContent>
                                                <PostWidget listing={listing} />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Paper>
                </Paper>
            )
        }
    }


    if(loggedUser.type === "User"){
        return (
            <Box>
                <Navbar />
                <ChatWidget />
                <>
                    <Fab color="secondary" aria-label="add" onClick={handleOpenDialog} style={{ position: "fixed", left: 20, bottom: 20 }}>
                        <AddIcon />
                    </Fab>
                    <CreateListingWidget open={openDialog} handleClose={handleCloseDialog} />
                </>
                <Grid container spacing={3} justifyContent="center" alignItems="stretch" mt={5}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={10} sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center", height: "auto" }}>
                            <Typography variant="h2" align="center" gutterBottom>
                                {user.username}
                            </Typography>
                            {renderButtons()}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        {renderOwnListings()}
                    </Grid>
                </Grid>
            </Box>
        );
    }
    else if(loggedUser.type === "Admin"){
        return (
            <Box>
                <Navbar />
                <Grid container spacing={3} justifyContent="center" alignItems="stretch" mt={5}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={10} sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center", height: "auto" }}>
                            <Typography variant="h2" align="center" gutterBottom>
                                {user.username}
                            </Typography>
                            {renderButtons()}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        {renderOwnListings()}
                    </Grid>
                </Grid>
            </Box>
        );
    }


};

export default ProfilePage;
