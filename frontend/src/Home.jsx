import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";

export default function Home() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isInitializing, setIsLoggedIn, setUser } =
    useContext(UserContext);

  useEffect(() => {
    if (!isLoggedIn && !isInitializing) {
      navigate("/login");
    }
  }, [isLoggedIn, isInitializing, navigate]);

  if (isInitializing || !user) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            My Frontend 1.0
          </Typography>
          <Button color="inherit" onClick={() => navigate("/item")}>
            Item
          </Button>
          {/* UI Control: Only shows if the user is the Admin (-1) */}
          {user._id === "-1" && (
            <Button color="inherit" onClick={() => navigate("/user")}>
              User
            </Button>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ px: 2, pt: 2 }}>
        <Outlet />
      </Box>
    </div>
  );
}
