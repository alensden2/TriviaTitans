import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import AWS from "aws-sdk";

const AWS_CONFIG = {
    region: 'us-east-1',
    accessKeyId: "ASIA4R6SGBPEHLZTWI7T",
    secretAccessKey: "i6eovxVOp3GTL3Xgu9aeBTXGjmcNJc+v+6VISZ+k",
    sessionToken: "FwoGZXIvYXdzEKf//////////wEaDG0H6UQkh8ffEYZiLiLAAbkRSpia0jAkIX9OBIr72S7IaJ8tBDFhKrFQ6KKLnMpn2ANGHXMAxUTDdtw6/bQ0gce09n84YivnkpBXFhMehqCfBkgvloF39UCWKe1/nJ3/zV9Wg9mw3GO1llpGYgw3Z7MVqWRprS2lmfVx+JYQXMc4ZY1ZQnJdFUo3wYWv4sURcuI2hfz74yH2ezLCAhGiJ3rBSLAdGvE7tlGq1s3EeWaar/uYdd534B5UX5uYg/sGTfCWZtWBTpevLS/QuNoFjii3y7emBjItzhqC+2lhlhEB43Aogi/5ZVl4I9z6FVpVy4Xgh9njqqlSzEpN6y1uegfbJbmt",
};

AWS.config.update(AWS_CONFIG);

export default function TeamMgmt() {
    const { user, logout } = UserAuth();
    const [open, setOpen] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [usersList, setUsersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [showAddMemberDialog, setShowAddMemberDialog] = useState(false); // Add this line
    let teamNameCurrent = ''//Replace with lambda to check the team

    useEffect(() => {
        // Fetch users list from the backend
        const lambdaEndpoint = "https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/get-all-users";
        axios.get(lambdaEndpoint)
            .then((response) => {
                if (response.status === 200) {
                    setUsersList(JSON.parse(response.data.body));
                }
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, []);

    const handleCreateNewTeam = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddMember = () => {
        setOpen(false);
        setShowAddMemberDialog(true);
    };
    
    const handleAddButtonClick = () => {
        // Implement your logic for adding the selected user to the team
         // this is team name - use lambda to find team using ID remove
         const team_name = localStorage.getItem("team-name")
        if (selectedUser) {
            const inviteData = {
                email: selectedUser,
                teamName: team_name,  // replace with lambda to check the cureent team 
            };

            const lambdaEndpoint = "https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/send-invite";
           
            axios.post(lambdaEndpoint, inviteData)
                .then((response) => {
                    if (response.status === 200) {
                        alert("Invited");
                    }
                })
                .catch((error) => {
                    console.error("Error inviting user:", error);
                });
        }
        setShowAddMemberDialog(false);
    };
    const handleCloseAddMemberDialog = () => {
        setShowAddMemberDialog(false);
    };

    const handleSelectUser = (email) => {
        setSelectedUser(email);
    };

    const handleSubmit = () => {
        const data = {
            uid: user.uid,
            teamName: teamName,
            members: []
        };

        // Append the current user's UID to the members array
        data.members.push(user.uid);

        // Replace 'YOUR_LAMBDA_ENDPOINT' with the actual Lambda ARN
        const lambdaEndpoint = "https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/create-new-teams";
console.log(data)
        axios
            .post(lambdaEndpoint, data,)
            .then((response) => {
                if (response.status === 200) {
                    // Success
                    alert("Team created")
                    teamNameCurrent = teamName
                    // temp solution the created team name is stored 
                    localStorage.setItem("team-name", teamName);
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

        // now update the team name on firebase userdetails table 

        const lambdaEndpoint_update_firestore = "https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/update-team-name";

        axios
            .post(lambdaEndpoint_update_firestore, {
                uid : user.uid,
                newTeamName: teamName
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(`User with email ${selectedUser} added to team successfully!`);
                } else {
                    console.log("Error adding user to team.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
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
                            <Button onClick={handleAddMember} variant="contained" color="secondary">
                                Add a team member to your team
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Footer />
                <Footer />
            </Box>

            {/* Popup Dialog for creating a new team */}
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
            <Dialog open={showAddMemberDialog} onClose={handleCloseAddMemberDialog}>
    <DialogTitle>Add Team Member</DialogTitle>
    <DialogContent>
    <List>
        {usersList.map((email) => (
            // Check if the email is not equal to the logged-in user's email
            email != user.email && (
                <ListItem button key={email} onClick={() => handleSelectUser(email)}>
                    <ListItemText primary={email} />
                    {selectedUser === email && (
                        <ListItemIcon>
                            <Button variant="contained" color="primary" onClick={handleAddButtonClick}>
                                Add
                            </Button>
                        </ListItemIcon>
                    )}
                </ListItem>
            )
        ))}
    </List>
</DialogContent>
    <DialogActions>
        <Button onClick={handleCloseAddMemberDialog} color="primary">
            Close
        </Button>
    </DialogActions>
</Dialog>
        </div>
    );
}
