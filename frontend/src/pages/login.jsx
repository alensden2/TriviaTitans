import { Box, Typography } from "@mui/material";
import Navbar from "../components/navbar";
import Form from "../components/form";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

function Login() {
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        navigate("/register");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="calc(100vh - 64px)"
            >
                <Box sx={{ gap: '20px', textAlign: 'center' }}>
                    <Form isLogin={true} />
                    <Typography variant="body2" component="p" onClick={handleSignUpClick} sx={{ marginTop: '20px', alignItems: 'center', justifyContent: 'center' }}>
                        Already Signed up? Sign in here!
                    </Typography>
                </Box>
            </Box>

            <Footer />
        </Box>
    );
}

export default Login;
