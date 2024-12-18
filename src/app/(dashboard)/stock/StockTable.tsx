import * as React from 'react';

import {useEffect, useState} from "react";

import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import axios from "axios";

import { useSession } from "next-auth/react";
import {Dialog, DialogContent, DialogTitle, LinearProgress} from "@mui/material";
import IconButton from "@mui/material/IconButton";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'brand', headerName: 'Brand', width: 260 },
  { field: 'itemName', headerName: 'Item', width: 260 },
  { field: 'itemCategory', headerName: 'Category', width: 200 },
  { field: 'itemPrice', headerName: 'Cost Price (per Unit)', width: 200 },
  { field: 'quantity', headerName: 'Quantity', width: 140 },
  { field: 'unit', headerName: 'Unit', width: 100 },
  { field: 'batch', headerName: 'Batch', width: 120 },
  { field: 'signal', headerName: 'Entry Type', width: 180 },
];

const paginationModel = { page: 0, pageSize: 10 };

function getSignal(quantity : number) {
  if (quantity > 0) {
    return "Entry";
  } else {
    return "Exit";
  }
}

function formatResult(result : any) {
  const r = [];

  for (let i = 0; i < result.length; i++) {
    r.push({
      id: result[i].id,
      brand: result[i].item.brand,
      itemName: result[i].item.name,
      itemCategory: result[i].item.category.name,
      itemPrice: "€ " + result[i].costPrice,
      quantity: result[i].quantity,
      unit: result[i].item.unit.name,
      batch: result[i].batch,
      signal: getSignal(result[i].quantity)
    });
  }

  return r;
}

const StockTable = () => {

  const { data: session } = useSession();
  const [inventory, setInventory] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    try {
      const fetchStockData = async () => {
        const response = await axios.get("http://localhost:8080/api/stock/1", {
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${session.accessToken}`, // Use template literals
          }
        });

        // @ts-ignore
        setStock(formatResult(response.data));
      }

      fetchStockData();

    } catch (e) {

    }
  }, [session]);

  const doubleClick = (e : any) => {
    setOpen(true)
    setLoading(true)
  }

  // DIALOG
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClose = (e : any) => {
    setOpen(false)
    setLoading(false);
  }

  return (
    <>
      <h2>Stock (Finished Products) - Beer Stock</h2>
      <br/>
      <Paper sx={{width: '100%'}}>
        <DataGrid
          rows={stock}
          disableMultipleRowSelection={true}
          disableRowSelectionOnClick={true}
          columns={columns}
          initialState={{pagination: {paginationModel}}}
          pageSizeOptions={[10, 15, 20]}
          sx={{border: 0}}
          onCellDoubleClick={doubleClick}
        />
      </Paper>

      <Dialog maxWidth={"md"} fullWidth={true} onClose={handleClose} open={open}>
        <DialogTitle>
          Stock Entry Details
          <IconButton
            aria-label='close'
            onClick={handleClose}
            className='absolute top-2.5 right-2.5 text-[var(--mui-palette-grey-500)]'>
            <i className='ri-close-line' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          { loading ? <LinearProgress color={"secondary"} /> : null }
        </DialogContent>
      </Dialog>
    </>
  );
}

export default StockTable
