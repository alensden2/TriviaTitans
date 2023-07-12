import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Form from "../components/form";
import Navbar from "../components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

function Login() {
  const navigate = useNavigate();

  const handleSignInWithGoogle = () => {
    // Google logic
  };

  const handleSignInWithFacebook = () => {
    // Facebook logic
  };

  const handleSignUpWithEmailAndPassword = () => {
    // Handle sign up with email and password logic
    navigate("/register"); // Redirect to registration page
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
        <Box sx={{ gap: "20px", textAlign: "center" }}>
          <Form isLogin={true} />
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSignInWithGoogle}
              startIcon={<FontAwesomeIcon icon={faGoogle} />}
            >
              Sign in with Google
            </Button>
            <Button
              variant="contained"
              onClick={handleSignInWithFacebook}
              startIcon={<FontAwesomeIcon icon={faFacebook} />}
            >
              Sign in with Facebook
            </Button>
          </Box>
          <Button
            variant="contained"
            onClick={handleSignUpWithEmailAndPassword}
          >
            Sign up with Email
          </Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default Login;
