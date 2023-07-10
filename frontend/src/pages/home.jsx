import { Box, Button } from "@mui/material";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const handleGetStarted = (event) => {
        navigate("/login")
    }
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Box>
        <Box sx={{ marginBottom: "-2rem" }}>
          <Navbar />
        </Box>
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: "16px",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ alignItems: "center", padding: "3rem" }}>
            <h1>Trivia Titans</h1>
            <Button onClick={handleGetStarted} variant="contained" color="success">
              Get Started
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
