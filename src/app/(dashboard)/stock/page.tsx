'use client'

import React, {useEffect, useState} from "react";

import axios from "axios";

import { useSession } from "next-auth/react";

import Button from "@mui/material/Button";
import {
  Alert,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select
} from "@mui/material";
import Grid from "@mui/material/Grid";

import TextField from "@mui/material/TextField";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ItemDropdown from "@/app/(dashboard)/inventory/ItemDropdown";
import LogisticsStatisticsCardEvolved from "@/app/(dashboard)/inventory/LogisticsStatisticsCardEvolved";
import UnitDropdown from "@/app/(dashboard)/inventory/UnitDropdown";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import Toast from "@/app/(dashboard)/stock/Toast";
import IconButton from "@mui/material/IconButton";
import StockTable from "@/app/(dashboard)/stock/StockTable";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import WarehouseDropdown from "@/app/(dashboard)/stock/WarehouseDropdown";

const Page = () => {
  const { data: session, status } = useSession(); // Get session and status
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const [units, setUnits] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedSupplier] = useState("-1");
  const [selectedWarehouse, setWarehouse] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [batch, setBatch] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(null);

  const [backdrop, setBackdrop] = useState(true);
  const [backdropSave, setBackdropSave] = useState(false)
  const [backendErrors, setBackendErrors] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [salePrice, setSalePrice] = useState(0.0);
  const [retailPrice, setRetailPrice] = useState(0.0);
  const [customsRegistered, setCustomsRegistered] = useState(true);

  const [costPriceNew, setCostPriceNew] = useState(0);
  const [salePriceNew, setSalePriceNew] = useState(0.0);
  const [retailPriceNew, setRetailPriceNew] = useState(0.0);

  const [typeOfEntry, setTypeOfEntry] = useState("Entry");

  const [updateOnSave, setUpdateOnSave] = useState(false);

  const onTypeOfEntry = (e : any) => {
    setTypeOfEntry(e.target.value);
  }

  const onItemSelect = (e : any) => {
    const selection = e.target.value;

    availableItems.map((item) => {
      if (item.id == selection) {
        setSelectedItem(item.id)
        setSalePrice(item.salePrice)
        setRetailPrice(item.retailPrice)
        setCostPrice(item.indicativeCostPrice)
        setCostPriceNew(item.indicativeCostPrice)
        setSalePriceNew(item.salePrice)
        setRetailPriceNew(item.retailPrice)
        setSelectedUnit(item.unit.id)
        warehouses.length == 1 ? setWarehouse(warehouses[0].id) : null
      }
    });
  }

  const onUnitSelect = (e : any) => {
    setSelectedUnit(e.target.value);
  }

  const onWarehouseSelect = (e : any) => {
    setWarehouse(e.target.value);
    warehouses.map((warehouse) => {
      if (warehouse.id == e.target.value) {
        setCustomsRegistered(warehouse.customsRegistered);
      }
    })
  }

  const handleClose = (value : any) => {
    handleDialogClose()
  }

  const handleDialogClose = () => {
    setOpen(false)
    setBackendErrors("")
    setQuantity(0)
    setSaveSuccess(false)
    setDate(null)
    setSelectedUnit("")
    setSelectedItem("")
    setWarehouse("")
    setRetailPrice(0)
    setSalePrice(0)
    setRetailPriceNew(0)
    setSalePriceNew(0)
    setCostPriceNew(0)
    setCostPrice(0)
  }

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    switch (id) {
      case 'quantity':
        setQuantity(Number(value));
        break;
      case 'costPrice':
        setCostPriceNew(Number(value));
        break;
      case 'batch':
        setBatch(value);
        break;
      case 'notes':
        setNotes(value);
        break;
      case 'retailPrice':
        setRetailPriceNew(value);
        break;
      case 'salePrice':
        setSalePriceNew(value);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    setSaveSuccess(false);
    setBackendErrors("")

    const data = {
      itemId: selectedItem,
      supplier: {
        id: selectedSupplier
      },
      warehouse: {
        id: selectedWarehouse
      },
      inventoryType: 0, //TODO TEMP
      quantity: typeOfEntry == "Entry" ? quantity : (quantity * -1),
      costPrice: costPriceNew != costPrice ? costPriceNew : costPrice,
      batch: batch,
      notes: notes,
      unitId: selectedUnit,
      salePrice: salePriceNew != salePrice ? salePriceNew : salePrice,
      retailPrice: retailPriceNew != retailPrice ? retailPriceNew : retailPrice,
      entryDate: date
    }

    if (data.quantity == 0) {
      setBackendErrors("Quantitity cannot be 0!")
    } else if (data.entryDate == "" || data.entryDate == undefined) {
      setBackendErrors("Please select an entry date!")
    } else {
      setBackdropSave(true)

      axios.post("http://localhost:8080/api/inventory/create", data, {
        xsrfCookieName: "next-auth.csrf-token",
        headers: {
          //@ts-ignore
          Authorization: `Bearer ${session.accessToken}`,
        },
      }).then(result => {
        setBackendErrors("")
        setSaveSuccess(true);
        setUpdateOnSave(true)
      }).catch(err => {
        setBackendErrors(err.response.data.details)
      }).finally(() => setBackdropSave(false));
    }
  }

  useEffect(() => {
    setUpdateOnSave(false)

    //@ts-ignore
    if (status === "authenticated" && session?.accessToken) {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/aggregator/stock", {
            xsrfCookieName: "next-auth.csrf-token",
            headers: {
              //@ts-ignore
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

          setStatistics(response.data);
          setLoading(false);
          setBackdrop(false)
        } catch (err) {
          // @ts-ignore
          setError(err);
          setLoading(false);
          setBackdrop(false)
        }
      };

      fetchData().then(() => {
        axios.get("http://localhost:8080/api/items/stock", {
          xsrfCookieName: "next-auth.csrf-token",
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${session.accessToken}`,
          },
        }).then((result) => {
          // @ts-ignore
          setAvailableItems(result.data);
        });
        axios.get("http://localhost:8080/api/units", {
          xsrfCookieName: "next-auth.csrf-token",
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${session.accessToken}`,
          },
        }).then(result => {
          // @ts-ignore
          setUnits(result.data);
        });
        axios.get("http://localhost:8080/api/warehouses", {
          xsrfCookieName: "next-auth.csrf-token",
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${session.accessToken}`,
          },
        }).then(result => {
          // @ts-ignore
          setWarehouses(result.data);
        });
      });
    } else if (status === "unauthenticated") {
      setBackdrop(false)
      setLoading(false); // Set loading to false if user is not authenticated
      // @ts-ignore
      setError(new Error("User is not authenticated"));
    }
  }, [session, status, updateOnSave]); // Run effect only when session or status changes

  // Loading state
  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner
  }

  // @ts-ignore
  // @ts-ignore
  return (
    <div>
      <Toast open={saveSuccess} />
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop
        sx={() => ({ color: '#fff', zIndex: 9999 })}
        open={backdropSave}
      >
        <CircularProgress color="inherit" />&nbsp; Saving...
      </Backdrop>
      <h1>Stock Dashboard</h1>
      <p>Management Board</p>
      <br />
      <Button variant="contained" startIcon={<i className={"ri-add-circle-line"}></i>}
              color="info" onClick={() => setOpen(true)}>New Entry / Exit</Button>
      <br /><br />
      {/* Pass fetched data to child components */}
      {statistics && <LogisticsStatisticsCardEvolved data={statistics} />}
      <br />
      <StockTable />

      <Dialog maxWidth={"md"} fullWidth={true} onClose={handleDialogClose} open={open}>
        <DialogTitle>
          Manual Stock Entry
          <IconButton
            aria-label='close'
            onClick={handleClose}
            className='absolute top-2.5 right-2.5 text-[var(--mui-palette-grey-500)]'>
            <i className='ri-close-line' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText className='mbe-3'>
            Manage your stock by adding entries / exits.
          </DialogContentText>
          <br/>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth={true}>
                <InputLabel id="entry-label">Type of Entry</InputLabel>
                <Select
                  required
                  onChange={onTypeOfEntry}
                  fullWidth={true}
                  size={"medium"}
                  label="Entry Type"
                  defaultValue="Entry"
                  id="entry"
                  labelId="entry-label"
                  variant={"outlined"}>
                  <MenuItem selected key={1} value={"Entry"}>
                    Entry
                  </MenuItem>
                  <MenuItem key={2} value={"Exit"}>
                    Exit
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <ItemDropdown availableItems={availableItems} onItemSelect={onItemSelect}/>
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={6}>
           <Grid item xs={12}>
             <Divider className='m-0 font-bold'>Pricing Details</Divider>
           </Grid>
            <Grid item xs={12} md={3}>
              <FormControl>
                <InputLabel htmlFor='costPrice'>Cost Price</InputLabel>
                <OutlinedInput
                  onChange={handleTextFieldChange}
                  label='Cost Price'
                  id='costPrice'
                  disabled={selectedItem == ""}
                  endAdornment={<InputAdornment position='end'>€</InputAdornment>}
                />
                { costPrice && costPrice != 0 ?
                  <FormHelperText>Current Price: {costPrice} €</FormHelperText>
                  : <></> }
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl>
                <InputLabel htmlFor='retailPrice'>Retail Price</InputLabel>
                <OutlinedInput
                  onChange={handleTextFieldChange}
                  label='Retail Price'
                  id='retailPrice'
                  disabled={selectedItem == ""}
                  endAdornment={<InputAdornment position='end'>€</InputAdornment>}
                  placeholder={retailPrice == null ? "0.00" : retailPrice.toString()}
                />
                { retailPrice && retailPrice != 0 ?
                  <FormHelperText>Current Price: {retailPrice} €</FormHelperText>
                  : <></> }
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl>
                <InputLabel htmlFor='salePrice'>PVP</InputLabel>
                <OutlinedInput
                  disabled={selectedItem == ""}
                  onChange={handleTextFieldChange}
                  label='PVP'
                  id='salePrice'
                  endAdornment={<InputAdornment position='end'>€</InputAdornment>}
                  placeholder={salePrice == null ? "0.00" : salePrice.toString()}
                />
                { salePrice && salePrice != 0 ?
                  <FormHelperText>Current Price: {salePrice} €</FormHelperText>
                  : <></> }
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <UnitDropdown disabled={true} units={units} onItemSelect={onUnitSelect} defaultUnit={selectedUnit} />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Divider className='m-0 font-bold'>Details</Divider>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField disabled={selectedItem == ""} required onChange={handleTextFieldChange} fullWidth id='quantity' type={"number"}
                         label='Quantity'/>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField disabled={selectedItem == ""} fullWidth onChange={handleTextFieldChange} id='batch' autoCapitalize={"on"} type={"text"}
                         label='Batch'/>
            </Grid>
            <Grid item xs={12} md={6}>
              <WarehouseDropdown disabled={selectedItem == ""} warehouses={warehouses} onItemSelect={onWarehouseSelect} defaultWarehouse={selectedWarehouse}/>
            </Grid>
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={6}></Grid>
            <Grid item xs={12} md={6}>
              { !customsRegistered ? <><br />
              <Alert severity={"warning"}>This is not a customs registered warehouse.</Alert></> : <></> }
            </Grid>
          </Grid>
          <br/>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField disabled={selectedItem == ""} fullWidth multiline rows={2} onChange={handleTextFieldChange} id='notes' label={"Notes"}/>
            </Grid>
          </Grid>
          <br/>
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              { backendErrors ?
                <Alert severity='error'>{backendErrors}</Alert> : <></> }
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Entry Date *"
                    format={"DD-MM-YYYY"}
                    // @ts-ignore
                    onChange={(value) => setDate(value)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined' color='error'>
            Discard
          </Button>
          <Button disabled={selectedItem == ""} onClick={handleSave} variant='contained' color='success'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;
