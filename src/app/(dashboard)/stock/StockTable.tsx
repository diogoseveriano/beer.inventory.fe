import * as React from 'react';

import {useEffect, useState} from "react";

import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import axios from "axios";

import { useSession } from "next-auth/react";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'brand', headerName: 'Brand', width: 260 },
  { field: 'itemName', headerName: 'Item', width: 260 },
  { field: 'itemCategory', headerName: 'Category', width: 200 },
  { field: 'itemPrice', headerName: 'Cost Price (per Unit)', width: 200 },
  { field: 'quantity', headerName: 'Quantity', width: 140 },
  { field: 'minQuantity', headerName: 'Minimum Quantity', width: 140 },
  { field: 'unit', headerName: 'Unit', width: 100 },
];

const paginationModel = { page: 0, pageSize: 10 };

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
      minQuantity: result[i].minQuantity,
      unit: result[i].unit.name
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
        />
      </Paper>
    </>
  );
}

export default StockTable
