import { Box, Typography } from "@mui/material";
import Navbar from "../components/navbar";
import Form from "../components/form";
import { useNavigate } from 'react-router-dom';

function Registration() {
    const navigate = useNavigate();
    const handleSignInClick = (event) => {
        event.preventDefault();
        navigate('/login');
    };
    return (
        <>
            <Box>
                <Navbar />
                <Box>
                    <Form isLogin={false} />
                </Box>
                <Box sx={{ gap: '20px', textAlign: 'center' }}>
                    <Typography variant="body2" onClick={handleSignInClick} component="p" sx={{ marginTop: '20px', alignItems: 'center', justifyContent: 'center' }}>
                        Already Signed up? Sign in here!
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export default Registration;