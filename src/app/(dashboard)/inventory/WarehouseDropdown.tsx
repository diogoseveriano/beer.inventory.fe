import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// @ts-ignore
const WarehouseDropdown = ({ disabled, warehouses, onItemSelect, defaultWarehouse, includeAll }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="warehouse-label">Warehouse *</InputLabel>
      <Select
        required
        disabled={disabled}
        onChange={onItemSelect}
        fullWidth
        size="medium"
        label="Warehouse"
        value={defaultWarehouse}  // Use `value={defaultWarehouse}` for controlled component
        id="warehouse"
        labelId="warehouse-label"
        variant="outlined"
      >
        {includeAll ? (
          <MenuItem key="ALL" value="ALL">
            ALL
          </MenuItem>
        ) : null }
        {warehouses && warehouses.length > 0 ? (
          warehouses.map((warehouse) => (
            <MenuItem key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No warehouses available</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default WarehouseDropdown;
