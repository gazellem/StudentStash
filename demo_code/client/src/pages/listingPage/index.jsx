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
  const { listingId } = useParams(); // Get the listing ID from URL
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({flatType: '', title: '', description: '', endDate: '' ,type: '',rentPrice: '',price:'',condition:'',place:'',date:'',activityCapacity:''});
    const [isListingSaved, setIsListingSaved] = useState(false);
  const token = useSelector((state) => state.token);
  const {_id} = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
    const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

  useEffect(() => {

    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:3500/listings/get/${listingId}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setListing(data);
        setEditData({...editData,type: data.type})
          console.log(user)
        setIsListingSaved(user.savedListings.includes(listingId));// Check if listing is saved

      } catch (error) {
        console.error("Error fetching listing:", error);
        // Handle errors appropriately
      } finally {
        setIsLoading(false);
      }
    };

      fetchListing();
  }, [user,listingId, user.savedListings]);


  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!listing) {
    return <p>Listing not found.</p>;
  }
  const renderListingDetails = () => {
    if(!listing)
      return <p>loading</p>
    switch (listing.type) {
      case 'BorrowingListing':
        return  <Typography variant="body1" align="center" gutterBottom>End Date: {listing.endDate}</Typography>
      case 'MateListing':
        return (
          <>
            <Typography variant="body1" align="center" gutterBottom>Flat Type: {listing.flatType}</Typography>
            <Typography variant="body1" align="center" gutterBottom>Rent Price: {listing.rentPrice}</Typography>
          </>
        );
      case 'SecondHandListing':
        return (
          <>
            <Typography variant="body1" align="center" gutterBottom>Price: {listing.price}</Typography>
            <Typography variant="body1" align="center" gutterBottom>Condition: {listing.condition}</Typography>
          </>
        );
      case 'ActivityBuddyListing':
        return(
          <>
            <Typography variant="body1" align="center" gutterBottom>Date: {listing.date}</Typography>
            <Typography variant="body1" align="center" gutterBottom>Place: {listing.place}</Typography>
            <Typography variant="body1" align="center" gutterBottom>Activity Capacity: {listing.activityCapacity}</Typography>
          </>
        );
        case 'DonationListing':
          return(
            <>
              <Typography variant="body1" align="center" gutterBottom>condition: {listing.condition}</Typography>
            </>
          );
          case 'LostAndFoundListing':
            return(
              <>
                <Typography variant="body1" align="center" gutterBottom>Date: {listing.date}</Typography>
                <Typography variant="body1" align="center" gutterBottom>Place: {listing.place}</Typography>
              </>
            );
      // Add cases for other listing types
      default:
        return null;
    }
  };


  const handleSaveListing = async () => {
    try {
      const obj = {listingId: listingId,userId: _id}
      const response = await fetch(`http://localhost:3500/users/save-listing`,
          {
            method: "POST",
            headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
            body: JSON.stringify(obj),
          }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const updatedUser = await response.json();
      console.log(updatedUser)
      dispatch(setUser({user: updatedUser}))
        setIsListingSaved(true)

    } catch (error) {
      console.error("Error fetching listing:", error);
      // Handle errors appropriately
    } finally {
      setIsLoading(false);
    }

  };

  const handleStartChat = async () => {
    try {
      const obj = {sender_username: user.username, receiver_username: listing.owner.username}
      const response = await fetch(`http://localhost:3500/chat`,
          {
            method: "POST",
            headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
            body: JSON.stringify(obj),
          }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

    } catch (error) {
      console.error("Error fetching listing:", error);
      // Handle errors appropriately
    } finally {
      setIsLoading(false);
      navigate(`/profile/${user.username}`)
    }
  };

  const isOwner = listing.owner.username === user.username;

  const handleEditChange = (e) => {
    setEditData({...editData,[e.target.name]: e.target.value})
  };

  const handleEditSave = async() =>{
      const response = await fetch(`http://localhost:3500/listings/update/${listingId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
            body: JSON.stringify(editData)
          }
      );
    setIsEditing(false)
  };

  const renderEditForm = () => {
    switch (listing.type) {
      case 'BorrowingListing':
        return (
            <>
              <TextField
                  margin="dense"
                  label="End Date"
                  type="text"
                  fullWidth
                  name="endDate"
                  value={editData.endDate}
                  onChange={handleEditChange}
              />
            </>
        );
      case 'MateListing':
        return (
            <>
                <TextField
                    margin="dense"
                    label="Flat Type"
                    type="text"
                    fullWidth
                    name="flatType"
                    value={editData.flatType}
                    onChange={handleEditChange}
                />
                <TextField
                    margin="dense"
                    label="Rent Price"
                    type="text"
                    fullWidth
                    name="rentPrice"
                    value={editData.rentPrice}
                    onChange={handleEditChange}
                />
            </>
        );
      case 'SecondHandListing':
        return (
            <>
                <TextField
                    margin="dense"
                    label="Condition"
                    type="text"
                    fullWidth
                    name="condition"
                    value={editData.condition}
                    onChange={handleEditChange}
                />
                <TextField
                    margin="dense"
                    label="Price"
                    type="text"
                    fullWidth
                    name="price"
                    value={editData.price}
                    onChange={handleEditChange}
                />
            </>
        );
      case 'ActivityBuddyListing':
        return(
            <>
                <TextField
                    margin="dense"
                    label="Date"
                    type="text"
                    fullWidth
                    name="date"
                    value={editData.date}
                    onChange={handleEditChange}
                />
                <TextField
                    margin="dense"
                    label="Place"
                    type="text"
                    fullWidth
                    name="place"
                    value={editData.place}
                    onChange={handleEditChange}
                />
                <TextField
                    margin="dense"
                    label="Capacity"
                    type="text"
                    fullWidth
                    name="capacity"
                    value={editData.capacity}
                    onChange={handleEditChange}
                />
            </>
        );
      case 'DonationListing':
        return(
            <>
                <TextField
                    margin="dense"
                    label="Condition"
                    type="text"
                    fullWidth
                    name="condition"
                    value={editData.condition}
                    onChange={handleEditChange}
                />
            </>
        );
      case 'LostAndFoundListing':
        return(
            <>
                <TextField
                    margin="dense"
                    label="Date"
                    type="text"
                    fullWidth
                    name="date"
                    value={editData.date}
                    onChange={handleEditChange}
                />
                <TextField
                    margin="dense"
                    label="Place"
                    type="text"
                    fullWidth
                    name="place"
                    value={editData.place}
                    onChange={handleEditChange}
                />
            </>
        );
        // Add cases for other listing types
      default:
        return null;
    }
  };


    const handleDeleteListing = async () => {
        try {
            const obj = {listingId: listingId,owner_username: listing.owner.username}
            const response = await fetch(`http://localhost:3500/listings`,
                {
                    method: "DELETE",
                    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                    body: JSON.stringify(obj),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const updatedUser = await response.json();
            console.log(updatedUser)
        } catch (error) {
            console.error("Error fetching listing:", error);
            // Handle errors appropriately
        } finally {
            setIsLoading(false);
        }
        navigate('/home')
    };


    async function handleUnsaveListing() {
        const obj = {listingId: listingId,username: user.username}
        const response = await fetch(`http://localhost:3500/users/unsave-listing`,
            {
                method: "POST",
                headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(obj),
            }
        );
        setIsListingSaved(false)
    }

    const renderPhotos = () => {
        if (listing && listing.photos && listing.photos.length > 0) {
            return (
                <Box sx={{ mt: 2 }}>
                    {listing.photos.map((photoUrl, index) => (
                        <img key={index} src={photoUrl} alt={`Listing Photo ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '300px', display: 'block', margin: 'auto' }} />
                    ))}
                </Box>
            );
        }
        return null; // Return null or a placeholder if no photos are available
    };
    const renderPhotoDialog = () => {
        return (
            <Dialog
                open={photoDialogOpen}
                onClose={() => setPhotoDialogOpen(false)}
                aria-labelledby="photo-dialog-title"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="photo-dialog-title">Photos</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        {listing.photos.map((photoUrl, index) => (
                            <img
                                key={index}
                                src={photoUrl}
                                alt={`Listing Photo ${index + 1}`}
                                style={{ maxWidth: '100%', marginBottom: '10px' }}
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPhotoDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    if(!isOwner){
    return (
        <Box>
          <Navbar/>
            <ChatWidget />
            <>
                <Fab color="secondary" aria-label="add" onClick={handleOpenDialog} style={{ position: 'fixed', left: 20, bottom: 20 }}>
                    <AddIcon />
                </Fab>
                <CreateListingWidget open={openDialog} handleClose={handleCloseDialog} />
            </>
            <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                <Paper elevation={3} style={{ padding: '20px', width: '100%', maxWidth: '1000px' }}>
                    <Typography variant="h2" align="center" gutterBottom>{listing.title}</Typography>
              {user && (
                  <Box textAlign="center">
                      <Typography variant="body1" gutterBottom>Posted by: {listing.owner.username}</Typography>
                      <Link to={`/profile/${listing.owner.username}`} style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}>
                          <Button variant="outlined" color="primary" size="small">
                              View Profile
                          </Button>
                      </Link>
                  </Box>
              )}
              <Divider style={{ margin: '20px 0' }} />
              <Typography variant="body1" align="center" gutterBottom>{listing.description}</Typography>
              <Divider style={{ margin: '20px 0' }} />


              {renderListingDetails()}
              <Divider style={{ margin: '20px 0' }} />
              <Box mt={2} textAlign="center">
                  <>
                      <Button variant="contained" color="primary" onClick={handleSaveListing} size="large">
                          Save Listing
                      </Button>
                      <Button variant="contained" color="primary" onClick={handleUnsaveListing} size="large" style={{ marginLeft: '10px' }}>
                          Unsave Listing
                      </Button>
                  </>
                <Button variant="contained" color="secondary" size="large" onClick={handleStartChat} style={{ marginLeft: '10px' }}>
                  Start Chat
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
    );
  }
  else
  {
    return (
        <Box>
          <Navbar/>
            <ChatWidget />
            <>
                <Fab color="primary" aria-label="add" onClick={handleOpenDialog} style={{ position: 'fixed', left: 20, bottom: 20 }}>
                    <AddIcon />
                </Fab>
                <CreateListingWidget open={openDialog} handleClose={handleCloseDialog} />
            </>
          <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
            <Paper elevation={3} style={{ padding: '20px', width: '100%', maxWidth: '1000px' }}>
              <Typography variant="h2" align="center" gutterBottom>{listing.title}</Typography>
              {user && (
                  <Box textAlign="center">
                      <Typography variant="body1" gutterBottom>Posted by: {listing.owner.username}</Typography>
                      <Link to={`/profile/${listing.owner.username}`} style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}>
                          <Button variant="outlined" color="primary" size="small">
                              View Profile
                          </Button>
                      </Link>
                  </Box>
              )}
              <Divider style={{ margin: '20px 0' }} />
              <Typography variant="body1" align="center" gutterBottom>{listing.description}</Typography>
                <Box display="flex" flexDirection="column" alignItems="center">
                    {listing.photos.length > 0 && (
                        <img
                            src={listing.photos[0]}
                            alt="Listing Preview"
                            style={{ cursor: 'pointer', maxWidth: '100%', maxHeight: '300px' }}
                            onClick={() => setPhotoDialogOpen(true)}
                        />
                    )}
                    <Typography variant="body2" align="center" size = 'small' gutterBottom>Click the photo to view all</Typography>
                    {renderPhotoDialog()} {/* Render the photo dialog */}
                </Box>
              <Divider style={{ margin: '20px 0' }} />
              {renderListingDetails()}
              <Divider style={{ margin: '20px 0' }} />
              <Box mt={2} textAlign="center">
                <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} size="large">
                  Edit Listing
                </Button>
                <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
                  <DialogTitle>Edit Listing</DialogTitle>
                  <DialogContent>
                      <TextField
                          margin="dense"
                          label="Title"
                          type="text"
                          fullWidth
                          name="title"
                          value={editData.title}
                          onChange={handleEditChange}
                      />
                      <TextField
                          margin="dense"
                          label="Description"
                          type="text"
                          fullWidth
                          name="description"
                          value={editData.description}
                          onChange={handleEditChange}
                      />
                    {renderEditForm()}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setIsEditing(false)} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleEditSave} color="primary">
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>
                <Button variant="contained" color="secondary" size="large" onClick={handleDeleteListing} style={{ marginLeft: '10px' }}>
                  Remove Listing
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
    );
  }
};

export default ListingPage;