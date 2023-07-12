import { Box, Typography } from "@mui/material";
import Navbar from "../components/navbar";
import Form from "../components/form";
import { useNavigate } from 'react-router-dom';
import Footer from "../components/footer";

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
                <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="calc(100vh - 64px)"
            >
                <Box sx={{ gap: '20px', textAlign: 'center' }}>
                    <Form isLogin={false} />
                    <Typography variant="body2" component="p" onClick={handleSignInClick} sx={{ marginTop: '20px', alignItems: 'center', justifyContent: 'center' }}>
                        Already Signed in? Sign in here!
                    </Typography>
                </Box>
            </Box>

            <Footer />
            </Box>
        </>
    )
}

export default Registration;