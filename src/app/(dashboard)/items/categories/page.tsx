'use client';

import React, { useEffect, useState } from 'react';

import { useSession } from "next-auth/react";

import axios from 'axios';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';

interface Item {
  id: number;
  name: string;
  type: 'stock' | 'inventory';
}

const Page = () => {
  const [items, setItems] = useState<Item[]>([]); // Categories list
  const [filterType, setFilterType] = useState<string>(''); // Filter by type
  const [dialogOpen, setDialogOpen] = useState(false); // For add/edit dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // For delete confirmation dialog
  const [currentItem, setCurrentItem] = useState<Partial<Item>>({}); // Current item state for adding/editing
  const [deleteId, setDeleteId] = useState<number | null>(null); // ID of item to delete
  const [loading, setLoading] = useState<boolean>(false); // Loader state
  const { data: session, status } = useSession(); // Get session and status

  // Fetch the categories initially
  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to fetch categories from the backend
  const fetchCategories = async () => {
    try {
      setLoading(true);

      axios.get('http://localhost:8080/api/categories', {
        headers: {
          //@ts-ignore
          Authorization: `Bearer ${session.accessToken}`, // Use template literals
        }
      }).then(response => setItems(response.data)); // GET request
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // API: Add or Edit a Category
  const saveItem = async () => {
    try {
      if (currentItem.id) {
        // EDIT operation
        await axios.put(`/api/categories/${currentItem.id}`, currentItem); // PUT request
        setItems((prev) =>
          prev.map((item) =>
            item.id === currentItem.id ? (currentItem as Item) : item
          )
        );
      } else {
        // ADD operation
        const response = await axios.post('/api/categories', currentItem); // POST request
        setItems((prev) => [...prev, response.data]); // Assume response contains new item
      }
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      closeDialog();
    }
  };

  // API: DELETE a Category
  const deleteItem = async () => {
    if (deleteId !== null) {
      try {
        await axios.delete(`/api/categories/${deleteId}`); // DELETE request
        setItems((prev) => prev.filter((item) => item.id !== deleteId));
      } catch (error) {
        console.error('Failed to delete item:', error);
      } finally {
        closeConfirmDialog();
      }
    }
  };

  // Dialog handlers
  const openDialog = (item?: Item) => {
    setCurrentItem(item || {}); // Set the current item (for edit) or empty (for add)
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentItem({});
  };

  // Confirmation dialog handlers
  const openConfirmDialog = (id: number) => {
    setDeleteId(id);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setDeleteId(null);
    setConfirmDialogOpen(false);
  };

  // Filter logic
  const filteredItems = filterType
    ? items.filter((item) => item.type === filterType)
    : items;

  return (
    <div>
      <h1>Item Categories</h1>
      <div style={{ marginBottom: '16px' }}>
        <FormControl style={{ marginRight: '16px', minWidth: '200px' }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="stock">Stock</MenuItem>
            <MenuItem value="inventory">Inventory</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openDialog()}
        >
          Add Item
        </Button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => openDialog(item)}
                    style={{ marginRight: '8px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => openConfirmDialog(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          {currentItem.id ? 'Edit Item' : 'Add Item'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={currentItem.name || ''}
            onChange={(e) =>
              setCurrentItem((prev) => ({ ...prev, name: e.target.value }))
            }
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={currentItem.type || ''}
              onChange={(e) =>
                setCurrentItem((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <MenuItem value="stock">Stock</MenuItem>
              <MenuItem value="inventory">Inventory</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={saveItem}
            color="primary"
            disabled={!currentItem.name || !currentItem.type} // Validation
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteItem} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;
