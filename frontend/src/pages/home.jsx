import { Box, Button } from "@mui/material";
import Navbar from "../components/navbar";

function Home() {
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
            <Button variant="contained" color="success">
              Get Started
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
