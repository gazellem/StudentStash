import { Card, CardContent, CardActionArea, Typography, Grid, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PostWidget = ({ listing }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listing/${listing._id}`); // Redirect to listing page
  };

  const renderListingDetails = () => {
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
      <Card onClick={handleClick} sx={{ cursor: 'pointer', marginBottom: 2, boxShadow: 3 }}>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {listing.title}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {listing.description}
            </Typography>
            <Grid container spacing={0}>
              {renderListingDetails()}
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
  );
};

export default PostWidget;