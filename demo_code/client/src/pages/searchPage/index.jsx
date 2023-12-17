import React, { useEffect, useState } from 'react';
import {useLocation, useNavigation} from 'react-router-dom';
import {Box, Typography, Card, CardContent, Fab, useMediaQuery, Grid, CardActionArea, Button} from '@mui/material';
import Navbar from "../navbar";
import ChatWidget from "../widgets/ChatWidget";
import AddIcon from "@mui/icons-material/Add";
import CreateListingWidget from "../widgets/CreateListingWidget";
import PostsWidget from "../widgets/PostsWidget";
import PostWidget from "../widgets/PostWidget";
import {useNavigate} from "react-router-dom";

const SearchPage = () => {
    const navigate = useNavigate()
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    // Function to fetch search results
    const fetchSearchResults = async (query) => {
        setIsLoading(true);
        console.log(query)
        try {
            const response = await fetch(`http://localhost:3500/listings/search/${query}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search).get('query');
        if (query) {
            fetchSearchResults(query);
        }
    }, [location.search]);

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    const returnToHome = () =>
    {
        navigate('/home')
    }
    return (
        <Box>
            <Navbar />
            <ChatWidget />
            <>
                <Fab color="primary" aria-label="add" onClick={handleOpenDialog} style={{ position: 'fixed', left: 20, bottom: 20 }}>
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
            {searchResults.length > 0 ? (
                <Box sx={{mt: 2, mx: 'auto', width: '100%', maxWidth: 600}}>
                    <Grid container spacing={2} justifyContent="center">
                        {searchResults.map((listing) => (
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
                </Box>
                )
                :
                (<div style={{textAlign: 'center', marginTop: '2rem'}}>
                        <Typography variant="h4" gutterBottom>
                            No results found
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Try a different search term or...
                        </Typography>
                        <Button variant="contained" color="primary" onClick={returnToHome}>
                            Go back to Home
                        </Button>
                    </div>
                )}

        </Box>
    );
};

export default SearchPage;