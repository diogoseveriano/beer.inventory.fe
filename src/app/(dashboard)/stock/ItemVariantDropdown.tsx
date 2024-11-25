import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// @ts-ignore
const Dropdown = ({ disabled, availableItems, onVariantSelect }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="item-variant-label">Item Variant *</InputLabel>
      <Select
        required
        disabled={disabled}
        onChange={onVariantSelect}
        fullWidth
        size="medium"
        label="Item Variant"
        defaultValue=""
        id="itemVariant"
        labelId="item-variant-label"
        variant="outlined"
      >
        {availableItems.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            [{item.code}] {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
