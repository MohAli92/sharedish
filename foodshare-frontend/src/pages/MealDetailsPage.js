import React from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";

const MealDetailsPage = () => {
  const { id } = useParams();

  return (
    <Container sx={{ mt: 5 }}>
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Meal Details
        </Typography>
        <Typography variant="body1">Meal ID: {id}</Typography>
      </Box>
    </Container>
  );
};

export default MealDetailsPage;
