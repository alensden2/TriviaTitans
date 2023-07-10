import { Box, Typography } from "@mui/material";
import Navbar from "../components/navbar";
import Form from "../components/form";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const handleSignUpClick = () => {
        navigate("/register");
    };
    return (
        <>
            <Box>
                <Navbar />
                <Box>
                    <Form isLogin={true} />
                </Box>
                <Box sx={{ gap: '20px', textAlign: 'center' }}>
                    <Typography variant="body2" onClick={handleSignUpClick} component="p" sx={{ marginTop: '20px', alignItems: 'center', justifyContent: 'center' }}>
                        New to the site? Sign up here!
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export default Login;