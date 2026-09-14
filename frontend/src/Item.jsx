import { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { UserContext } from "./context/UserContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Item() {
  const [items, setItems] = useState([]);
  const { user } = useContext(UserContext);

  const fetchItems = async () => {
    const response = await fetch(`${API_URL}/api/item`, {
      headers: { "x-user-id": user?._id || "" },
    });
    if (response.ok) {
      const data = await response.json();
      setItems(data.data);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreateMockItem = async () => {
    const response = await fetch(`${API_URL}/api/item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user?._id || "",
      },
      body: JSON.stringify({ name: "Test Item", price: 100 }),
    });
    if (response.ok) fetchItems();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Item Management
      </Typography>
      <Button variant="contained" onClick={handleCreateMockItem} sx={{ mb: 2 }}>
        Create Mock Item (Triggers Audit Log)
      </Button>
      <List>
        {items?.map((item) => (
          <ListItem key={item._id}>
            <ListItemText
              primary={item.name}
              secondary={`Price: $${item.price}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
