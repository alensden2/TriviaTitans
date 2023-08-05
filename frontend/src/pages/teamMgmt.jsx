import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';
import AWS from 'aws-sdk';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { UserAuth } from '../context/AuthContext';
import styles from './teamMgmt.module.css';

const AWS_CONFIG = {
    region: 'us-east-1',
    accessKeyId: "ASIA4R6SGBPEL3GR55WY",
    secretAccessKey: "1PRdfUP7WsYgpSaFiSjXXTLvaQeF6SVHhn60JLZO",
    sessionToken: "FwoGZXIvYXdzELj//////////wEaDD5SPZCWsnwJcIBtRiLAAU6OnolBMJv5Sxzyp4UfWRcME3AAKO34M/6RfGIF+vq8ycF2L3RFkPuTgrM+bp/esnYNdAblBgGMCuijVQMeBB5yVH81ebypiuOUohlpT8u6c54EooD1TqXAEmTyKrN/bnEs7hIFaWMMstAhGDoflSt6gaLW541urIUCx1TpPnfiVJKfjCgug4aZVb1OKtxvneTJwpAgiqnYiK5+GFizDHMgci5OdQHAiLa4bvIh9sRNjxS9tl0oDqNUXdi2p5SVViiBkbumBjItY0cBjqiAORj42yGyG4HdGraCTnEcP3QyFam9GHIkBRqQs655ML7bdnobkxeJ",
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
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamAdmin, setTeamAdmin] = useState('');
    const showInvitationPopup = (teamId) => {
        setTeamInvitation(teamId);
    };

    // Fetch users list from the backend and set it in state
    useEffect(() => {
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

    const [userDetails, setUserDetails] = useState(null);

    // Fetch user details based on the user's UID
    useEffect(() => {
        const lambdaEndpointGetUserDetails =
            'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/get-item-by-uid';
        axios
            .post(lambdaEndpointGetUserDetails, {
                uid: user.uid,
            })
            .then((response) => {
                if (response.status === 200) {
                    setUserDetails(JSON.parse(response.data.body));
                }
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    }, []);

    // Function to handle creating a new team
    const handleCreateNewTeam = () => {
        setOpen(true);
    };

    // Function to handle closing the dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Function to handle adding a team member
    const handleAddMember = () => {
        setOpen(false);
        setShowAddMemberDialog(true);
    };

    // Function to handle adding a selected user to the team
    const handleAddButtonClick = () => {

        const team_name = localStorage.getItem('team-name');
        if (selectedUser) {
            const inviteData = {
                email: selectedUser,
                teamName: team_name,
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

    // Function to handle closing the "Add Member" dialog
    const handleCloseAddMemberDialog = () => {
        setShowAddMemberDialog(false);
    };

    // Function to handle selecting a user from the list
    const handleSelectUser = (email) => {
        setSelectedUser(email);
    };

    // Function to remove a user from the team
    const handleRemoveUser = async (uid, teamName) => {
        const apiUrl = 'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/remove-leave-user';

        try {
            const response = await axios.post(apiUrl, {
                teamName: teamName,
                uid: uid,
            });

            if (response.status === 200) {
                alert('User removed from the team successfully');
            } else {
                alert('Failed to remove user from the team');
            }
        } catch (error) {
            console.error('Error removing user from the team:', error);
            alert('An error occurred while removing the user from the team');
        }
    };
    // Function to promote a user to admin
    const handlePromoteToAdmin = (uid, teamName) => {
        const apiEndpoint = 'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/promote-to-admin';

        const requestData = {
            uid: uid,
            teamName: teamName,
        };

        axios
            .post(apiEndpoint, requestData)
            .then((response) => {
                if (response.status === 200 && response.data.message === 'TeamAdmin updated successfully') {
                    // User promoted successfully
                    alert('User promoted to admin!');
                } else {
                    // Handle other response statuses or messages if needed
                    alert('User Promoted');
                }
            })
            .catch((error) => {
                console.error('Error promoting user to admin:', error);
                alert('An error occurred while promoting user to admin.');
            });
    };

    // Function to fetch the team members and admin for the current user's team
    const fetchTeamMembers = () => {
        const lambdaEndpoint = 'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/team-members-by-id';
        axios
            .post(lambdaEndpoint, {
                teamName: userDetails?.teamName,
            })
            .then((response) => {
                if (response.status === 200) {
                    const data = JSON.parse(response.data.body);
                    setTeamMembers(data.members);
                    setTeamAdmin(data.teamAdmin);
                }
            })
            .catch((error) => {
                console.error('Error fetching team members:', error);
            });
    };

    // Fetch team members and admin when userDetails.teamName changes
    useEffect(() => {
        if (userDetails?.teamName) {
            fetchTeamMembers();
        }
    }, [userDetails?.teamName]);

    // Function to handle submitting the new team creation
    const handleSubmit = () => {
        const data = {
            uid: user.uid,
            teamName: teamName,
            members: [],
        };

        data.members.push(user.uid);

        const lambdaEndpoint = 'https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/create-new-teams';
        console.log(data);
        axios
            .post(lambdaEndpoint, data)
            .then((response) => {
                if (response.status === 200) {

                    alert('Team created');
                    localStorage.setItem('team-name', teamName);
                    console.log('Team created successfully!');
                } else {
                    console.log('Error creating team.');
                }
                setOpen(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setOpen(false);
            });
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

    // Function to handle the user's response to a team invitation
    const handleInvitationResponse = (accepted) => {
        if (accepted) {
            alert('You have accepted the team invitation.');
            console.log(teamInvitation);
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
                                } else {
                                    console.log('Error adding user as a member to the team.');
                                }
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                    } else {
                        console.log('Error adding user to team.');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            alert('You have declined the team invitation.');
        }
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

                            {userDetails && userDetails.teamName && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">Team Name: {userDetails.teamName}</Typography>
                                            <Typography variant="body1">UID: {userDetails.uid}</Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            )}

                            {teamMembers.length > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">Team Members:</Typography>
                                            <List>
                                                {teamMembers.map((memberUid) => (
                                                    <ListItem key={memberUid}>
                                                        <ListItemText primary={`UID: ${memberUid}`} />
                                                        {user.uid === teamAdmin && memberUid !== teamAdmin && (
                                                            <Box>
                                                                <Button variant="contained" color="secondary" onClick={() => handlePromoteToAdmin(memberUid, userDetails.teamName)}>
                                                                    Promote to Admin
                                                                </Button>
                                                                <Button variant="contained" color="primary" onClick={() => handleRemoveUser(memberUid, userDetails.teamName)}>
                                                                    Remove / Leave
                                                                </Button>
                                                            </Box>
                                                        )}
                                                        {user.uid !== teamAdmin && memberUid === user.uid && (
                                                            <Button variant="contained" color="primary" onClick={() => handleRemoveUser(memberUid, userDetails.teamName)}>
                                                                Remove User
                                                            </Button>
                                                        )}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Box>
                            )}

                            {(!userDetails || !userDetails.teamName) && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                                    <Typography variant="h6">No Team Yet</Typography>
                                </Box>
                            )}

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
            <Dialog
                open={showAddMemberDialog}
                onClose={handleCloseAddMemberDialog}
                className={styles.dialogContainer}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '49rem',
                        maxWidth: '600px',
                    },
                }}
            >
                <DialogTitle className={styles.dialogTitle}>Add Team Member</DialogTitle>
                <DialogContent>
                    <List className={styles.listContainer}>
                        {usersList.map((email) => (
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
