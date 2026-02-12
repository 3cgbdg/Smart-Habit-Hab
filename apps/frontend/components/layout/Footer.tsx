import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        py: 2,
        px: 3,
        mt: "auto",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
      >
        © 2026 Smart Habit Lab. All rights reserved.
      </Typography>
    </Box>
  );
}
