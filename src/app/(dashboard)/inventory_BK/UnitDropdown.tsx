import React from 'react';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// @ts-ignore
const UnitDropdown = ({ disabled, units, onItemSelect, defaultUnit }) => {
  return (
    <FormControl fullWidth={true}>
      <InputLabel id="unit-label">Unit *</InputLabel>
      <Select
        required
        disabled={disabled}
        onChange={onItemSelect}
        fullWidth={true}
        size={"medium"}
        label="Unit"
        value={defaultUnit}  // or use `value={selectedValue}` for a controlled component
        id="unit"
        labelId="unit-label"
        variant={"outlined"}>
        {
          units && units.length > 0 ?
            units.map((unit) => {
              return (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.name}
                </MenuItem>
              );
            }) : null
        }
      </Select>
    </FormControl>
  );
};

export default UnitDropdown;
