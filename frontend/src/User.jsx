import { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { UserContext } from "./context/UserContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function User() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const { user } = useContext(UserContext); // Used to pass mock header

  const fetchUsers = async () => {
    // Passing x-user-id header manually to simulate the backend JWT proxy
    const response = await fetch(`${API_URL}/api/user`, {
      headers: { "x-user-id": user?._id },
    });
    if (response.ok) {
      const data = await response.json();
      setUsers(data.data.users);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (id) => {
    setSelectedUserId(id);
    setNewPassword("");
    setOpen(true);
  };

  const handleChangePassword = async () => {
    const response = await fetch(`${API_URL}/api/user/${selectedUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user?._id, // Passing admin ID to pass backend isAdmin check
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (response.ok) {
      alert("Password changed successfully!");
      setOpen(false);
    } else {
      alert("Failed to change password.");
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        User Management
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((u) => (
            <TableRow key={u._id}>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog(u._id)}
                >
                  Change Password
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="standard"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleChangePassword}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
