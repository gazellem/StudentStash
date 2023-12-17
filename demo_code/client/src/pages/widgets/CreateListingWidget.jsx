import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const CreateListingWidget = ({ open, handleClose }) => {
    const  user = useSelector((state) => state.user);
    const  token = useSelector((state) => state.token);
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);

    const handlePhotoChange = (event) => {
        setPhotos(event.target.files);
    };
    const [listingData, setListingData] = useState({
        type: '',
        title: '',
        description: '',
        endDate: '', // For BorrowingListing
        flatType: '', // For MateListing
        rentPrice: '', // For MateListing
        price: '', // For SecondHandListing
        condition: '', // For SecondHandListing and DonationListing
        date: '', // For ActivityBuddyListing and LostAndFoundListing
        place: '', // For ActivityBuddyListing and LostAndFoundListing
        activityCapacity: '' // For ActivityBuddyListing

    });
    const handleChange = (e) => {
        setListingData({ ...listingData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async () => {
        const listingObj = {
            type: listingData.type,
            title:listingData.title,
            description: listingData.description,
            endDate: listingData.endDate, // For BorrowingListing
            flatType: listingData.flatType, // For MateListing
            rentPrice: listingData.rentPrice, // For MateListing
            price: listingData.price, // For SecondHandListing
            condition: listingData.condition, // For SecondHandListing and DonationListing
            date: listingData.date, // For ActivityBuddyListing and LostAndFoundListing
            place: listingData.place, // For ActivityBuddyListing and LostAndFoundListing
            activityCapacity: listingData.activityCapacity, // For ActivityBuddyListing
            owner_username: user.username}
        const formData = new FormData();
        formData.append('type', listingData.type);
        formData.append('title', listingData.title);
        formData.append('description', listingData.description);
        formData.append('endDate',listingData.endDate);
        formData.append('flatType',listingData.flatType);
        formData.append('rentPrice',listingData.flatType);
        formData.append('price',listingData.price);
        formData.append('condition',listingData.condition);
        formData.append('date',listingData.date);
        formData.append('place',listingData.place);
        formData.append('activityCapacity',listingData.activityCapacity);
        formData.append('owner_username',user.username)
        // Append photos
        for (let i = 0; i < photos.length; i++) {
            formData.append('photos', photos[i]);
        }

        try {
            const response = await fetch(`http://localhost:3500/listings/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to create listing');
            }
            // Handle successful response
            handleClose();
            navigate(`/profile/${user.username}`);
        } catch (error) {
            console.error("Error creating listing:", error);
            // Handle errors appropriately
        }
    };

    const renderEditForm = () => {
        switch (listingData.type) {
            case 'BorrowingListing':
                return (
                    <>
                        <TextField
                            margin="dense"
                            label="End Date"
                            type="text"
                            fullWidth
                            name="endDate"
                            value={listingData.endDate}
                            onChange={handleChange}
                        />
                        <TextField
                            type="file"
                            inputProps={{
                                accept: "image/*", // Accepts all image types
                                multiple: true
                            }}
                            onChange={handlePhotoChange}
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
                            value={listingData.flatType}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Rent Price"
                            type="text"
                            fullWidth
                            name="rentPrice"
                            value={listingData.rentPrice}
                            onChange={handleChange}
                        />
                        <TextField
                            type="file"
                            inputProps={{
                                accept: "image/*", // Accepts all image types
                                multiple: true
                            }}
                            onChange={handlePhotoChange}
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
                            value={listingData.condition}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Price"
                            type="text"
                            fullWidth
                            name="price"
                            value={listingData.price}
                            onChange={handleChange}
                        />
                        <TextField
                            type="file"
                            inputProps={{
                                accept: "image/*", // Accepts all image types
                                multiple: true
                            }}
                            onChange={handlePhotoChange}
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
                            value={listingData.date}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Place"
                            type="text"
                            fullWidth
                            name="place"
                            value={listingData.place}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Capacity"
                            type="text"
                            fullWidth
                            name="activityCapacity"
                            value={listingData.activityCapacity}
                            onChange={handleChange}
                        />
                        <TextField
                            type="file"
                            inputProps={{
                                accept: "image/*", // Accepts all image types
                                multiple: true
                            }}
                            onChange={handlePhotoChange}
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
                            value={listingData.condition}
                            onChange={handleChange}
                        />
                        <TextField
                            type="file"
                            inputProps={{
                                accept: "image/*", // Accepts all image types
                                multiple: true
                            }}
                            onChange={handlePhotoChange}
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
                            value={listingData.date}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Place"
                            type="text"
                            fullWidth
                            name="place"
                            value={listingData.place}
                            onChange={handleChange}
                        />
                        <TextField
                            type="file"
                            inputProps={{
                                accept: "image/*", // Accepts all image types
                                multiple: true
                            }}
                            onChange={handlePhotoChange}
                        />

                    </>
                );
            // Add cases for other listing types
            default:
                return null;
        }
    };
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create a New Listing</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select name="type" value={listingData.type} label="Type" onChange={handleChange}>
                        <MenuItem value="BorrowingListing">Borrowing Listing</MenuItem>
                        <MenuItem value="MateListing">Mate Listing</MenuItem>
                        <MenuItem value="SecondHandListing">Second Hand Listing</MenuItem>
                        <MenuItem value="ActivityBuddyListing">Activity Buddy Listing</MenuItem>
                        <MenuItem value="DonationListing">Donation Listing</MenuItem>
                        <MenuItem value="LostAndFoundListing">Lost and Found Listing</MenuItem>
                    </Select>
                </FormControl>
                <TextField fullWidth margin="normal" label="Title" name="title" value={listingData.title} onChange={handleChange} />
                <TextField fullWidth margin="normal" label="Description" name="description" value={listingData.description} onChange={handleChange} />
                {renderEditForm()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateListingWidget;
