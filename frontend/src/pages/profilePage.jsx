import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Stack, IconButton } from "@mui/material";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function ProfilePage() {
  const initialUserDetails = {
    profilePicture: "",
    name: "",
    email: "",
    phone: "",
  };

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState(initialUserDetails);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.post("https://us-central1-serverlessproject-9d011.cloudfunctions.net/getUserDetails", {
        uid: "123", // Replace with the desired uid value
      });

      const userData = response.data; // Assuming the response is an object with user details
      console.log(userData);

      setUserDetails(userData);
      setEditedName(userData.name);
      setEditedEmail(userData.email);
      setEditedPhoneNumber(userData.phone);
      
      

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error occurred while fetching user details");
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

 // ... (Other imports and component definition)

const handleSaveProfile = async () => {
  if (!editedName || !editedEmail || !editedPhoneNumber) {
    toast.error("Please fill in all fields");
    return;
  }

  try {
    setLoading(true);

    if (selectedImage) {
      // Prepare the form data with the image file and other user details
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('uid', '123'); // Replace this with the actual 'uid'
      formData.append('name', editedName);
      formData.append('email', editedEmail);
      formData.append('phone', editedPhoneNumber);

      // Replace 'YOUR_IMAGE_UPLOAD_ENDPOINT' with the actual API endpoint to handle image uploads on the server
      const uploadUrl = "https://us-central1-serverlessproject-9d011.cloudfunctions.net/uploadImage";

      // Send the form data to the server
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type as multipart/form-data
        },
      });

      // Assuming the server returns a URL for the uploaded image, update the user details with the new URL
      const updatedUserDetails = {
        uid: "123", // Replace this with the actual 'uid'
        name: editedName,
        email: editedEmail,
        phone: editedPhoneNumber,
        profilePicture: response.data.imageUrl, // Replace 'imageUrl' with the actual field returned by the server
      };

      // Assuming you have an API endpoint to update user details, modify the URL accordingly
      await axios.post("https://us-east1-serverlessproject-9d011.cloudfunctions.net/updateDetails", updatedUserDetails);

      setUserDetails(updatedUserDetails);
      setIsEditing(false);
      setLoading(false);
      toast.success("Profile saved successfully");
    } else {
      // If there is no selected image, update the user details without the profile picture
      const updatedUserDetails = {
        uid: "123", // Replace this with the actual 'uid'
        name: editedName,
        email: editedEmail,
        phone: editedPhoneNumber,
      };

      // Assuming you have an API endpoint to update user details, modify the URL accordingly
      await axios.post("https://us-east1-serverlessproject-9d011.cloudfunctions.net/updateDetails", updatedUserDetails);

      setUserDetails(updatedUserDetails);
      setIsEditing(false);
      setLoading(false);
      toast.success("Profile saved successfully");
    }
  } catch (error) {
    console.log(error);
    toast.error("Error occurred while saving profile");
    setLoading(false);
  }
};


  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box
          sx={{
            maxWidth: "500px",
            width: "100%",
            padding: "16px",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {loading ? (
            <Typography variant="h5">Loading...</Typography>
          ) : (
            <>
              <Stack direction="column" spacing={2} alignItems="center">
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Profile"
                    style={{ borderRadius: "50%", width: "200px", height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <img
                   // src={userDetails.profilePicture}
                    alt="Profile"
                    style={{ borderRadius: "50%", width: "200px", height: "200px", objectFit: "cover" }}
                  />
                )}
                {isEditing && (
                  <IconButton color="primary" component="label">
                    <input
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                    <PhotoCameraIcon />
                  </IconButton>
                )}
              </Stack>
              <Stack direction="column" spacing={2} alignItems="center" mt={4}>
                {isEditing ? (
                  <>
                    <TextField
                      label="Name"
                      variant="outlined"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                    <TextField
                      label="Email"
                      variant="outlined"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                    />
                    <TextField
                      label="Phone Number"
                      variant="outlined"
                      value={editedPhoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                        setEditedPhoneNumber(value);
                      }}
                    />
                    <Button variant="contained" onClick={handleSaveProfile}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="h4" component="div">
                      {userDetails.name}
                    </Typography>
                    <Typography variant="body1" component="div">
                      Email: {userDetails.email}
                    </Typography>
                    <Typography variant="body1" component="div">
                      Phone Number: {userDetails.phone}
                    </Typography>
                    <Button variant="contained" onClick={handleEditProfile}>
                      Edit Profile
                    </Button>
                  </>
                )}
              </Stack>
            </>
          )}
        </Box>
      </Box>
      <Footer />
      <ToastContainer />
    </Box>
  );
}

export default ProfilePage;
