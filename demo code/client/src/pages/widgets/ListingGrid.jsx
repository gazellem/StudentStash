import React from 'react';
import { Grid, Card, CardContent, CardActionArea, Typography, Chip } from "@mui/material";

const ListingGrid = ({ listings, onListingClick }) => {
    const renderListingDetails = (listing) => {
        if (!listing) return <p>Loading...</p>;
        switch (listing.type) {
            case 'BorrowingListing':
                return <Chip label={`End Date: ${listing.endDate}`} variant="outlined" />;
            case 'MateListing':
                return (
                    <>
                        <Chip label={`Flat Type: ${listing.flatType}`} variant="outlined" />
                        <Chip label={`Rent Price: ${listing.rentPrice}`} variant="outlined" />
                    </>
                );
            case 'SecondHandListing':
                return (
                    <>
                        <Chip label={`Price: ${listing.price}`} variant="outlined" />
                        <Chip label={`Condition: ${listing.condition}`} variant="outlined" />
                    </>
                );
            case 'ActivityBuddyListing':
                return (
                    <>
                        <Chip label={`Date: ${listing.date}`} variant="outlined" />
                        <Chip label={`Place: ${listing.place}`} variant="outlined" />
                        <Chip label={`Capacity: ${listing.activityCapacity}`} variant="outlined" />
                    </>
                );
            case 'DonationListing':
                return <Chip label={`Condition: ${listing.condition}`} variant="outlined" />;
            case 'LostAndFoundListing':
                return (
                    <>
                        <Chip label={`Date: ${listing.date}`} variant="outlined" />
                        <Chip label={`Place: ${listing.place}`} variant="outlined" />
                    </>
                );
            // Add cases for other listing types
            default:
                return null;
        }
    };

    return (
        <Grid container spacing={2} justifyContent="center">
            {listings.map((listing) => (
                <Grid item key={listing._id} xs={12} sm={6} md={4}>
                    <Card elevation={3} sx={{ '&:hover': { boxShadow: 6 } }} onClick={() => onListingClick(listing._id)}>
                        <CardActionArea>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>{listing.title}</Typography>
                                <Typography variant="body2" gutterBottom>{listing.description}</Typography>
                                <Grid container spacing={1}>{renderListingDetails(listing)}</Grid>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ListingGrid;