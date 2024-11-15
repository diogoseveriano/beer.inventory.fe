import React from 'react';

import { FormControl, InputLabel, Select, MenuItem, ListSubheader } from '@mui/material';

// @ts-ignore
const Dropdown = ({ availableItems, onItemSelect }) => {
  // Group items by category
  const groupedItems = availableItems.reduce((acc, item) => {
    const categoryName = item.category.name;

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }

    acc[categoryName].push(item);

return acc;
  }, {});

  return (
    <FormControl fullWidth={true}>
      <InputLabel id="item-label">Item *</InputLabel>
      <Select
        required
        onChange={onItemSelect}
        fullWidth={true}
        size={"medium"}
        label="Item"
        defaultValue=""
        id="item"
        labelId="item-label"
        variant={"outlined"}>
        {Object.keys(groupedItems).map((categoryName) => [
          <ListSubheader key={categoryName}>{categoryName}</ListSubheader>,
          ...groupedItems[categoryName].map((item) => (
            <MenuItem key={item.id} value={item.id}>
              [{item.code}] {item.name}
            </MenuItem>
          )),
        ])}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
