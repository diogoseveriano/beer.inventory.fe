import React from 'react';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// @ts-ignore
const UnitDropdown = ({ units, onItemSelect }) => {
  return (
    <FormControl fullWidth={true}>
      <InputLabel id="unit-label">Unit *</InputLabel>
      <Select
        required
        onChange={onItemSelect}
        fullWidth={true}
        size={"medium"}
        label="Unit"
        defaultValue=""  // or use `value={selectedValue}` for a controlled component
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
