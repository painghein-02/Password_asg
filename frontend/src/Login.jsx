import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { Button, Box, Typography } from "@mui/material";

export default function Login() {
  const { setUser, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  // Mock authentication to test the hardcoded Admin ID requirement
  const handleLogin = (isAdmin) => {
    const userData = isAdmin
      ? { _id: "-1", username: "admin" }
      : { _id: "123", username: "standard_user" };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    navigate("/");
  };

  return (
    <Box sx={{ p: 4, textAlign: "center", mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        My Frontend 1.0 Login
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleLogin(true)}
        sx={{ m: 1 }}
      >
        Mock Login as Admin (ID: -1)
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleLogin(false)}
        sx={{ m: 1 }}
      >
        Mock Login as User
      </Button>
    </Box>
  );
}
