import * as React from 'react';

import {useEffect, useState} from "react";

import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import axios from "axios";

import { useSession } from "next-auth/react";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'brand', headerName: 'Brand', width: 140 },
  { field: 'itemName', headerName: 'Item', width: 200 },
  { field: 'itemCategory', headerName: 'Category', width: 180 },
  { field: 'itemPrice', headerName: 'Cost Price (per Unit)', width: 200 },
  { field: 'quantity', headerName: 'Quantity', width: 140 },
  { field: 'unit', headerName: 'Unit', width: 100 },
  { field: 'batch', headerName: 'Batch', width: 120 },
  { field: 'signal', headerName: 'Entry Type', width: 180 },
  { field: 'entryDate', headerName: 'Entry Date', width: 200 }
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
      quantity: "" + result[i].quantity,
      unit: result[i].unit.name,
      batch: result[i].batch,
      signal: getSignal(result[i].quantity),
      entryDate: result[i].entryDate
    });
  }

  return r;
}

const InventoryTable = () => {

  const { data: session } = useSession();
  const [inventory, setInventory] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    try {
      const fetchInventoryData = async () => {
        const response = await axios.get("http://localhost:8080/api/inventory/1", {
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${session.accessToken}`, // Use template literals
          }
        });

        // @ts-ignore
        setInventory(formatResult(response.data));
      }

      fetchInventoryData();

    } catch (e) {

    }
  }, [session]);

  return (
    <>
      <h2>Inventory</h2>
      <br/>
      <Paper sx={{width: '100%'}}>
        <DataGrid
          rows={inventory}
          disableMultipleRowSelection={true}
          disableRowSelectionOnClick={true}
          columns={columns}
          initialState={{pagination: {paginationModel}}}
          pageSizeOptions={[10, 15, 20]}
          sx={{border: 0}}
        />
      </Paper>
    </>
  );
}

export default InventoryTable
