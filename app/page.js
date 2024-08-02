"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Grid,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { ThemeProvider as StyledThemeProvider } from "@mui/system";
import { Roboto } from "@fontsource/roboto";

// Define custom theme with Roboto font
const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [updateOpen, setUpdateOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map((doc) => ({
      name: doc.id,
      ...doc.data(),
    }));
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1,
        });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const normalizedItem = item.trim().toLowerCase();
    const docRef = doc(collection(firestore, "inventory"), normalizedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, {
        quantity: quantity + 1,
      });
    } else {
      await setDoc(docRef, {
        quantity: 1,
      });
    }

    await updateInventory();
  };

  const updateItemQuantity = async (item, quantity) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    await setDoc(docRef, {
      quantity,
    });
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpdateOpen = (item) => {
    setCurrentItem(item.name);
    setNewQuantity(item.quantity);
    setUpdateOpen(true);
  };
  const handleUpdateClose = () => setUpdateOpen(false);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          bgcolor: "#f4f6f8",
          p: 2,
        }}
      >
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Modal open={updateOpen} onClose={handleUpdateClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6">Update Item Quantity</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                type="number"
                variant="outlined"
                fullWidth
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
              />
              <Button
                variant="contained"
                onClick={() => {
                  updateItemQuantity(currentItem, newQuantity);
                  handleUpdateClose();
                }}
              >
                Update
              </Button>
            </Stack>
          </Box>
        </Modal>

        <TextField
          variant="outlined"
          placeholder="Search items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Item
        </Button>
        <Box
          sx={{
            border: "1px solid #333",
            width: 800,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              height: 100,
              bgcolor: "#3f51b5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h2" color="#fff">
              Inventory Items
            </Typography>
          </Box>

          <Grid
            container
            spacing={2}
            sx={{
              height: 300,
              overflowY: "auto",
              overflowX: "hidden",
              bgcolor: "#fff",
              p: 2,
            }}
          >
            {filteredInventory.map(({ name, quantity }) => (
              <Grid
                item
                xs={12} // Full width for each item
                key={name}
                sx={{
                  bgcolor: "#f0f0f0",
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => removeItem(name)}
                  >
                    -
                  </Button>
                  <Typography variant="h6">{quantity}</Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => addItem(name)}
                  >
                    +
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleUpdateOpen({ name, quantity })}
                  >
                    Update
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
