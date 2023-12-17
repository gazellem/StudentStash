import React, { useEffect, useState } from 'react';
import {useLocation, useNavigation, useParams} from 'react-router-dom';
import {Box, Typography, Card, CardContent, Fab, useMediaQuery, Grid, CardActionArea, Button} from '@mui/material';
import Navbar from "../navbar";
import ChatWidget from "../widgets/ChatWidget";
import AddIcon from "@mui/icons-material/Add";
import CreateListingWidget from "../widgets/CreateListingWidget";
import PostsWidget from "../widgets/PostsWidget";
import PostWidget from "../widgets/PostWidget";
import {useNavigate} from "react-router-dom";
import {setPosts} from "../../state";
import {useDispatch, useSelector} from "react-redux";

const FilterPage = () => {
    const navigate = useNavigate()
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const { filter } = useParams();
    const [filteredListings, setFilteredListings] = useState([]);
    // Function to fetch search results
    useEffect(() => {
        // Fetch own listings if viewing own profile
        const fetchFilteredResults = async () => {
            // Replace with actual endpoint to fetch user's own listings
            const response = await fetch(`http://localhost:3500/listings/filter/${filter}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const listings = await response.json();
            setFilteredListings(listings);
        };
        fetchFilteredResults();

    }, [filter]);

    const returnToHome = () =>
    {
        navigate('/home')
    }
    return (
        <Box>
            <Navbar />
            <ChatWidget />
            <>
                <Fab color="secondary" aria-label="add" onClick={handleOpenDialog} style={{ position: 'fixed', left: 20, bottom: 20 }}>
                    <AddIcon />
                </Fab>
                <CreateListingWidget open={openDialog} handleClose={handleCloseDialog} />
            </>
            <Box
                width="100%"
                padding="0.5rem 6%"
                display={isNonMobileScreens ? "grid" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
                gridTemplateColumns={isNonMobileScreens ? "repeat(3, 1fr)" : "1fr"}>

            </Box>
            {filteredListings.length > 0 ? (
                    <Box sx={{mt: 2, mx: 'auto', width: '100%', maxWidth: 600}}>
                        <Grid container spacing={2} justifyContent="center">
                            {filteredListings.map((listing) => (
                                <Grid item key={listing._id} xs={12}>
                                    <Card elevation={3} sx={{'&:hover': {boxShadow: 6}}}>
                                        <CardActionArea>
                                            <CardContent>
                                                <PostWidget listing={listing}/>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <div style={{textAlign: 'center', marginTop: '1rem'}}>
                            <Button variant="contained" color="primary" onClick={returnToHome}>
                                Go back to Home
                            </Button>
                        </div>
                    </Box>) :
                (<div style={{textAlign: 'center', marginTop: '2rem'}}>
                        <Typography variant="h4" gutterBottom>
                            No results found
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Select a different filter
                        </Typography>
                        <Button variant="contained" color="primary" onClick={returnToHome}>
                            Go back to Home
                        </Button>
                    </div>
                )}

        </Box>
    );
};

export default FilterPage;