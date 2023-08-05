import React, { useState, useEffect } from 'react';
import styles from './teamMgmt.module.css';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { UserAuth } from '../context/AuthContext';
import axios from 'axios';
import AWS from 'aws-sdk';

const AWS_CONFIG = {
    region: 'us-east-1',
    accessKeyId: "ASIA4R6SGBPEI7G6H3NP",
    secretAccessKey: "EAx7fiXLxxjIT3wbIbMedtKF2BFaOl/C2smHm5Vo",
    sessionToken: "FwoGZXIvYXdzEK///////////wEaDIk/nw/Gg0Qcl3e8eiLAAfS+HG4OrpTMZkCWLEpdETSG6MOsbFzUvWH6YtyyumJzc5qp9J525baIKaRdQPj2tWaLx2UnJCHGDJ0+Iu9eZAcpHB6XcrrM/dkyeQ3gA5iRoKpPKMnwXI07VuJuvXCtJqe86t4sfccXzdmfKLMt/C+wm7rf/GGl14pf/MiMIQfIB7d6oyO7yVuljO9XG3WOWpmLTAmgzBN2wAmpqCwm2qN37zIC9QPiat3RdWbXcqufFMkKkDRM4OS5AZTNIbDiwSizo7mmBjItP8rsUpREN0GXLiSkPOjMwcadLpz7X3RTDlavmsGEgh5Frt0HPVsFHfWuo4fW",
};

AWS.config.update(AWS_CONFIG);

export default function TeamMgmt() {
    const { user, logout } = UserAuth();
    const [open, setOpen] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [usersList, setUsersList] = useState([]);
    const [teamInvitation, setTeamInvitation] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
    let teamNameCurrent = ''; // Replace with lambda to check the team
    const showInvitationPopup = (teamId) => {
        setTeamInvitation(teamId);
    };
    useEffect(() => {
        // Fetch users list from the backend
        const lambdaEndpoint = 'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/get-all-users';
        axios
            .get(lambdaEndpoint)
            .then((response) => {
                if (response.status === 200) {
                    setUsersList(JSON.parse(response.data.body));
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
        console.log("gjhkjlhkjk", user.email)
        // Check if the user has been invited to a team
        const inviteLambdaEndpoint = 'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/receive-invite';
        axios
            .post(inviteLambdaEndpoint, {
                email: user.email,
            })
            .then((response) => {
                if (response.status === 200) {
                    const data = JSON.parse(response.data.body);
                    if (data.user) {
                        const teamId = data.user.Attributes.teamId;
                        showInvitationPopup(teamId);
                    }
                }
            })
            .catch((error) => {
                console.error('Error checking invite status:', error);
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
        const team_name = localStorage.getItem('team-name');
        if (selectedUser) {
            const inviteData = {
                email: selectedUser,
                teamName: team_name, // replace with lambda to check the current team
            };

            const lambdaEndpoint = 'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/send-invite';

            axios
                .post(lambdaEndpoint, inviteData)
                .then((response) => {
                    if (response.status === 200) {
                        alert('Invited');
                    }
                })
                .catch((error) => {
                    console.error('Error inviting user:', error);
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
            members: [],
        };

        // Append the current user's UID to the members array
        data.members.push(user.uid);

        // Replace 'YOUR_LAMBDA_ENDPOINT' with the actual Lambda ARN
        const lambdaEndpoint = 'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/create-new-teams';
        console.log(data);
        axios
            .post(lambdaEndpoint, data)
            .then((response) => {
                if (response.status === 200) {
                    // Success
                    alert('Team created');
                    teamNameCurrent = teamName;
                    // temp solution the created team name is stored
                    localStorage.setItem('team-name', teamName);
                    console.log('Team created successfully!');
                } else {
                    // Handle error
                    console.log('Error creating team.');
                }
                setOpen(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setOpen(false);
            });

        // now update the team name on firebase userdetails table

        const lambdaEndpoint_update_firestore =
            'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/update-team-name';

        axios
            .post(lambdaEndpoint_update_firestore, {
                uid: user.uid,
                newTeamName: teamName,
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(`User with email ${selectedUser} added to team successfully!`);
                } else {
                    console.log('Error adding user to team.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    const handleInvitationResponse = (accepted) => {
        if (accepted) {
            // User accepted the invitation
            alert('You have accepted the team invitation.');
            console.log(teamInvitation);

            // First Axios call to update the team name for the user
            const lambdaEndpointUpdateFirestore =
                'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/update-team-name';

            axios
                .post(lambdaEndpointUpdateFirestore, {
                    uid: user.uid,
                    newTeamName: teamInvitation,
                })
                .then((response) => {
                    if (response.status === 200) {
                        console.log(`User with email ${selectedUser} added to team successfully!`);

                        // Second Axios call to add the user as a member to the team
                        const lambdaEndpointAddMember =
                            'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/add-member';

                        axios
                            .post(lambdaEndpointAddMember, {
                                teamName: teamInvitation,
                                uid: user.uid,
                            })
                            .then((response) => {
                                if (response.status === 200) {
                                    console.log(`User with email ${selectedUser} added as a member to the team.`);
                                    // Perform any additional actions as needed after successfully adding the user as a member
                                } else {
                                    console.log('Error adding user as a member to the team.');
                                    // Perform any additional actions as needed if the second Axios call fails
                                }
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                                // Perform any additional actions as needed if the second Axios call fails
                            });
                    } else {
                        console.log('Error adding user to team.');
                        // Perform any additional actions as needed if the first Axios call fails
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    // Perform any additional actions as needed if the first Axios call fails
                });
        } else {
            // User declined the invitation
            alert('You have declined the team invitation.');
            // Perform any additional actions as needed...
        }
        // Close the invitation popup
        setTeamInvitation('');


    };
    return (
        <div>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Box>
                        <Box sx={{ marginBottom: '-2rem' }}>
                            <Navbar />
                        </Box>

                        {/* Main content */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: 'calc(100vh - 64px)', // Adjust for Navbar height
                            }}
                        >
                            <h1 variant="h5" component="div" gutterBottom>
                                Hi {user && user.email}! Welcome to your profile!
                            </h1>

                            {/* Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                                <Button onClick={handleCreateNewTeam} variant="contained" color="primary" sx={{ marginRight: '1rem' }}>
                                    Create New Team
                                </Button>
                                <Button onClick={handleAddMember} variant="contained" color="secondary">
                                    Add a Team Member
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Footer />
            </Box>

            {/* Popup Dialog for creating a new team */}
            <Dialog open={open} onClose={handleClose} className={styles.dialogContainer}>
                <DialogTitle className={styles.dialogTitle}>Create New Team</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Team Name"
                        type="text"
                        fullWidth
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className={styles.textField}
                    />
                </DialogContent>
                <DialogActions className={styles.dialogActions}>
                    <Button onClick={handleClose} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Popup Dialog for adding a team member */}
            <Dialog open={showAddMemberDialog}
                onClose={handleCloseAddMemberDialog}
                className={styles.dialogContainer}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '49rem', // Adjust the width as per your preference
                        maxWidth: '600px', // Limit the maximum width if needed
                    },
                }}>
                <DialogTitle className={styles.dialogTitle}>Add Team Member</DialogTitle>
                <DialogContent>
                    <List className={styles.listContainer}>
                        {usersList.map((email) => (
                            // Check if the email is not equal to the logged-in user's email
                            email !== user.email && (
                                <ListItem
                                    button
                                    key={email}
                                    onClick={() => handleSelectUser(email)}
                                    className={selectedUser === email ? styles.selectedItem : ''}
                                >
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
                <DialogActions className={styles.dialogActions}>
                    <Button onClick={handleCloseAddMemberDialog} color="primary" variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Popup Dialog for invitation */}
            <Dialog open={teamInvitation !== ''} onClose={() => setTeamName('')}>
                <DialogTitle>Team Invitation</DialogTitle>
                <DialogContent>
                    <p>You have been invited to join the team {teamInvitation}.</p>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => handleInvitationResponse(false)}>
                        No
                    </Button>
                    <Button color="primary" onClick={() => handleInvitationResponse(true)}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
