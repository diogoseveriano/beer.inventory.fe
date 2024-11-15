import React from 'react';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// @ts-ignore
const WarehouseDropdown = ({ warehouses, onItemSelect }) => {
  return (
    <FormControl fullWidth={true}>
      <InputLabel id="warehouse-label">Warehouse *</InputLabel>
      <Select
        required
        onChange={onItemSelect}
        fullWidth={true}
        size={"medium"}
        label="Warehouse"
        defaultValue=""  // or use `value={selectedValue}` for a controlled component
        id="warehouse"
        labelId="warehouse-label"
        variant={"outlined"}>
        {
          warehouses && warehouses.length > 0 ?
            warehouses.map((warehouse) => {
              return (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              );
            }) : null
        }
      </Select>
    </FormControl>
  );
};

export default WarehouseDropdown;
