import { Box, Button } from '@mui/material';
import React from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { UserAuth } from "../context/AuthContext";

export default function TeamMgmt() {
    const { user, logout } = UserAuth();
    const handleCreateNewTeam = () => {
        console.log(user)
    }
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
        </div>
    )
}
