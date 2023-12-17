import React, {useEffect, useState} from 'react';
import { Box, Fab, Card, Button, Grid, useMediaQuery, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from "pages/navbar";
import ChatWidget from "../widgets/ChatWidget";
import PostsWidget from "pages/widgets/PostsWidget";
import CreateListingWidget from 'pages/widgets/CreateListingWidget';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import ReportsWidget from "../widgets/ReportsWidget";
import UserWidget from "../widgets/UserWidget";


const HomePage = () => {
    const [showBannedUsers, setShowBannedUsers] = useState(false);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
    const loggedUser = useSelector((state) =>state.user)
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    const [bannedUsers, setBannedUsers] = useState([]);

    const ListingButton = ({ text, onClick }) => (
        <Card variant="outlined" sx={{ mb: 2, boxShadow: 2 }}>
            <Button
                variant="contained"
                size="large"
                onClick={onClick}
                sx={{
                    width: '100%',
                    bgcolor: 'primary',
                    color: 'text.primary',
                    '&:hover': {
                        bgcolor: 'grey.200',
                        boxShadow: 4
                    }
                }}
            >
                {text}
            </Button>
        </Card>
    );
    useEffect(() => {
        const getBannedUsers = async () => {
            const response = await fetch(`http://localhost:3500/users/bannedUsers`, {
                method: "GET",
            });
            const data = await response.json();
            setBannedUsers(data);
        };
        getBannedUsers()
    },[]);
    const navigateToFilter = (filter) => {
        navigate(`/filter/${filter}`);
    };

    const toggleBannedUsers = () => {
        setShowBannedUsers(!showBannedUsers);
    };

    if(loggedUser.type === "User") {
        return (
            <Box>
                <Navbar/>
                <ChatWidget/>
                <>
                    <Fab color="secondary" aria-label="add" onClick={handleOpenDialog}
                         sx={{position: 'fixed', left: 20, bottom: 20}}>
                        <AddIcon/>
                    </Fab>
                    <CreateListingWidget open={openDialog} handleClose={handleCloseDialog}/>
                </>

                <Grid container spacing={2} justifyContent="center" sx={{padding: '1rem 10%'}}>
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" align="center" gutterBottom>Listing Categories</Typography>
                        <ListingButton text="Second Hand Listing"
                                       onClick={() => navigateToFilter("SecondHandListing")}/>
                        <ListingButton text="Borrowing Listing" onClick={() => navigateToFilter("BorrowingListing")}/>
                        <ListingButton text="Donation Listing" onClick={() => navigateToFilter("DonationListing")}/>
                        <ListingButton text="Activity Listing"
                                       onClick={() => navigateToFilter("ActivityBuddyListing")}/>
                        <ListingButton text="Lost & Found Listing"
                                       onClick={() => navigateToFilter("LostAndFoundListing")}/>
                        <ListingButton text="Mate Listing" onClick={() => navigateToFilter("MateListing")}/>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <PostsWidget/>
                    </Grid>
                </Grid>
            </Box>
        );
    }
    else if(loggedUser.type ==="Admin"){
        return (
            <Box>
                <Navbar/>
                <Grid container spacing={2} justifyContent="center" sx={{padding: '1rem 10%'}}>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={toggleBannedUsers}
                            sx={{ marginBottom: 2 }}
                        >
                            {showBannedUsers ? 'Hide Banned Users' : 'Show Banned Users'}
                        </Button>
                    </Grid>
                    {showBannedUsers && (
                        <Grid item xs={12}>
                            {bannedUsers.map(user => (
                                <UserWidget key={user.username} user={user} />
                            ))}
                        </Grid>
                    )}
                    <Grid item xs={12} md={8}>
                        <ReportsWidget />
                    </Grid>
                </Grid>
            </Box>
        );
    }
};

export default HomePage;
