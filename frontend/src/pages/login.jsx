import { Box } from "@mui/material";
import Navbar from "../components/navbar";
import Form from "../components/form";

function Login() {
    return (
        <>
        <Box>
            <Box>
            <Navbar/>
            </Box>
            <Box>
            <h1>Login page</h1>
            <Form />
            </Box>
        </Box>
        </>
    )
}

export default Login;