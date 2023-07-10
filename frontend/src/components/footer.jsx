import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <Typography variant="body2" align="center" color="textSecondary" fontFamily="Arial">
        hello trivia enthusiasts! A game made by Trivia Enthusiasts, For Trivia enthusiasts
      </Typography>
    </Box>
  );
}

export default Footer;
