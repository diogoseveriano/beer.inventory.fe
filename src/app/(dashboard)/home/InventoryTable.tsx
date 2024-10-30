import * as React from 'react';

import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 120 },
  { field: 'itemName', headerName: 'Item', width: 260 },
  { field: 'itemCategory', headerName: 'Category', width: 200 },
  { field: 'itemPrice', headerName: 'Cost Price', width: 200 },
  { field: 'quantity', headerName: 'Quantity', width: 200 },
  { field: 'unit', headerName: 'Unit', width: 120 },
  { field: 'minQuantity', headerName: 'Minimum Quantity', width: 200 },
];

const rows = [
  { id: 1, itemName: 'Pilsner', itemCategory: 'Malt', itemPrice: "35.25 €", quantity: 10, unit: 'Unit', minQuantity: 1 },
  { id: 2, itemName: 'Pale Ale', itemCategory: 'Malt', itemPrice: "28.33 €", quantity: 2, unit: 'Unit', minQuantity: 1 },
];

const paginationModel = { page: 0, pageSize: 5 };

const InventoryTable = () => {
  return (
    <Paper sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}

export default InventoryTable
