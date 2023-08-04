import { Box, Button } from "@mui/material";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Typography from '@mui/material/Typography';
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";
import { useEffect } from "react";

function ProfilePage() {

  const {user, logout} = UserAuth();
  const userEmail = "user@example.com";
  const navigate = useNavigate();
  const handleTeamMgmt = () => {
    navigate('/teamMgmt')
  }

  // calling the lambda to create a new sns topic and check 
  useEffect(() => {
    // Only call the Lambda if user.email is not undefined
    if (user?.email) {
      const AWS_CONFIG = {
        region: 'us-east-1',
        accessKeyId: "ASIA4R6SGBPEO5QLSO3W",
        secretAccessKey: "mAgC8nq0dUSWYd+g4Zck+XFfUVJ/O4VseYCAPOUb",
        sessionToken: "FwoGZXIvYXdzEJf//////////wEaDBM0Mn4lt0TL8bMf4CLAAb+XHmtEp8E3SQPfOuYF6D1wk6eJjCci4npRCu+n6Q8DKsLry/QC13oM5Ybv149dOg7QndII1MwGMfjc8fycRSAhwULWSairMydFQYjOlr/hLpVHHbZ06CMJwskclSAciq47Zyv+sAG05VwMSBN/9R9MEPKTO1InoihLXLG+R6g6noGn23Bg2NhowAREaOuUjZtIb/6IDNpKM5qg9NTG9c7bOaguuKFGc4Vq9KTtX86Yb+HX55MYwW3cEmEiulaaKyip/rOmBjItnEcB6oIFnm2IO4xvrzPfBcdoSyeqtd5Kdkzpo6q3TG9Pbs1vcqCEq43B8rIp",
    };
      AWS.config.update(AWS_CONFIG);

      const lambda = new AWS.Lambda({ region: "us-east-1" });
      const payload = {
        topicName: user.uid,
      };
      const params = {
        FunctionName: "arn:aws:lambda:us-east-1:863192353736:function:createUserSNS",
        Payload: JSON.stringify(payload),
      };

      console.log("Invoke lambda");
      lambda.invoke(params, (err, data) => {
        if (err) {
          console.log("error: ", err);
        } else {
          console.log("Lambda worked. SNS topic generated", payload);
        }
      });
    }
  }, [user?.email]);

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
  