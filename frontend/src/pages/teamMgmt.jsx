import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import React, { useState } from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { UserAuth } from "../context/AuthContext";
import axios from "axios"
import AWS from "aws-sdk"
const AWS_CONFIG = {
    region: 'us-east-1',
    accessKeyId: "ASIA4R6SGBPEBK2OLFPD",
    secretAccessKey: "QwwsrL+9NxJikxWOPcKhjKk+EIyzVLh2z4PzkzUj",
    sessionToken: "FwoGZXIvYXdzEJv//////////wEaDOmjFzBiOjb38r/Q8SLAAd/tcBTdN4ViearNxpsSC78Qa+qm4JLvz/1DRb5e6nxqesXFiyl+NysTYINFMJ3xYTR0cgh9Id5Dr4H2pC49R+81ArD3syoA8d2sWVlcRvgZKkA7uS6ta8YY/Yr+0xBIzpLib36mA/xUerA+xfxAKqyzVJQ+YE55RJvSZhlRBnUBSUqA+4nh1IfxTI7tZJ4IYui0HMBJv405gnqcydiCsd46MT4Z4Oqdp754p0etwyH0PuP92tIgPS0SrRN13jnZ7ij187SmBjItkAPZu7DgWt7Ps4jthEIX3D/9LTtLdD5QMSNHr4PgxeHDMVN8GhMnw62vFgUw",
};
AWS.config.update(AWS_CONFIG);
export default function TeamMgmt() {
    const { user, logout } = UserAuth();
    const [open, setOpen] = useState(false);
    const [teamName, setTeamName] = useState('');

    const handleCreateNewTeam = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {
        const data = {
            uid: user.uid,
            teamName: teamName,
            members: []
        };

        // Append the current user's UID to the members array
        data.members.push({ uid: user.uid });

        // Replace 'YOUR_LAMBDA_ENDPOINT' with the actual Lambda ARN
        const lambdaEndpoint = "https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/create-new-teams";

        axios
            .post(lambdaEndpoint, data,)
            .then((response) => {
                if (response.status === 200) {
                    // Success
                    console.log("Team created successfully!");
                } else {
                    // Handle error
                    console.log("Error creating team.");
                }
                setOpen(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setOpen(false);
            });
    };

    return (
        <div>
            <Box>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <Box>
                        <Box sx={{ marginBottom: "-2rem" }}>
                            <Navbar />
                        </Box>
                        <Box sx={{ textAlign: "left", marginTop: "-27rem", marginLeft: "-46rem" }}>
                            <h1 variant="h5" component="div" gutterBottom>
                                Hi {user && user.email}! Welcome to your profile!
                            </h1>
                            <Button onClick={handleCreateNewTeam} variant="contained" color="primary">
                                Create New Team
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Footer />
                <Footer />
            </Box>

            {/* Popup Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Team Name"
                        type="text"
                        fullWidth
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
