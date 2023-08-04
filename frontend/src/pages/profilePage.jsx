import { Box, Button } from "@mui/material";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Typography from '@mui/material/Typography';
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


function ProfilePage() {

  const {user, logout} = UserAuth();
  const userEmail = "user@example.com";
  const navigate = useNavigate();
  const handleTeamMgmt = () => {
    navigate('/teamMgmt')
  }
    return (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Box>
            <Box sx={{ marginBottom: "-2rem" }}>
              <Navbar />
            </Box>
            <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
              <Typography variant="h5" component="div" gutterBottom>
                Hi {user && user.email}! Welcome to your profile!
              </Typography>
              <Button onClick={handleTeamMgmt} variant="contained" color="primary">
                Team Management
              </Button>
            </Box>
          </Box>
        </Box>
        <Footer />
      </Box>
    );
  }
  
  export default ProfilePage;
  