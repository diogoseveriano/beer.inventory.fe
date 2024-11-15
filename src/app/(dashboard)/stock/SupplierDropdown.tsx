import React from 'react';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// @ts-ignore
const SupplierDropdown = ({ suppliers, onItemSelect }) => {
  return (
    <FormControl fullWidth={true}>
      <InputLabel id="supplier-label">Supplier *</InputLabel>
      <Select
        required
        onChange={onItemSelect}
        fullWidth={true}
        size={"medium"}
        label="Warehouse"
        defaultValue=""  // or use `value={selectedValue}` for a controlled component
        id="supplier"
        labelId="supplier-label"
        variant={"outlined"}>
        <MenuItem key={"-1"} value={"-1"}>
          -- NOT DEFINED --
        </MenuItem>
        {
          suppliers && suppliers.length > 0 ?
            suppliers.map((supplier) => {
              return (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              );
            }) : null
        }
      </Select>
    </FormControl>
  );
};

export default SupplierDropdown;
