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
  DialogTitle, FormControl, InputLabel, OutlinedInput
} from "@mui/material";
import Grid from "@mui/material/Grid";

import TextField from "@mui/material/TextField";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ItemDropdown from "@/app/(dashboard)/inventory_BK/ItemDropdown";
import InventoryTable from "@/app/(dashboard)/inventory_BK/InventoryTable";
import LogisticsStatisticsCardEvolved from "@/app/(dashboard)/inventory_BK/LogisticsStatisticsCardEvolved";
import UnitDropdown from "@/app/(dashboard)/inventory_BK/UnitDropdown";
import SupplierDropdown from "@/app/(dashboard)/inventory_BK/SupplierDropdown";
import WarehouseDropdown from "@/app/(dashboard)/inventory_BK/WarehouseDropdown";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import Toast from "@/app/(dashboard)/inventory_BK/Toast";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

const Page = () => {
  const { data: session, status } = useSession(); // Get session and status
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const [units, setUnits] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [itemBrand, setItemBrand] = useState("");
  const [itemDescription, setItemDescription] = useState("")

  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedSupplier, setSupplier] = useState("");
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

  const onItemSelect = (e : any) => {
    const selection = e.target.value;

    availableItems.map((item) => {
      if (item.id == selection) {
        setItemBrand(item.brand)
        setItemDescription(item.description)
        setSelectedItem(item.id)
      }
    });
  }

  const onUnitSelect = (e : any) => {
    setSelectedUnit(e.target.value);
  }

  const onSupplierSelect = (e : any) => {
    setSupplier(e.target.value);
  }

  const onWarehouseSelect = (e : any) => {
    setWarehouse(e.target.value);
  }

  const handleClose = (value : any) => {
    handleDialogClose()
  }

  const handleDialogClose = () => {
    setOpen(false)
    setItemDescription("")
    setItemBrand("")
    setBackendErrors("")
    setQuantity(0)
    setSaveSuccess(false)
    setDate(null)
    setSelectedUnit("")
    setSelectedItem("")
  }

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    switch (id) {
      case 'quantity':
        setQuantity(Number(value));
        break;
      case 'costPrice':
        setCostPrice(Number(value));
        break;
      case 'batch':
        setBatch(value);
        break;
      case 'notes':
        setNotes(value);
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
      inventoryType: 2, //TODO TEMP
      quantity: quantity,
      costPrice: costPrice,
      batch: batch,
      notes: notes,
      unitId: selectedUnit,
      salePrice: 0.0,
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
        //handleDialogClose();
        setSaveSuccess(true);
      }).catch(err => {
        setBackendErrors(err.response.data.details)
      }).finally(() => setBackdropSave(false));
    }
  }

  useEffect(() => {
    //@ts-ignore
    if (status === "authenticated" && session?.accessToken) {
      const fetchData = async () => {
        try {
          // Fetch data from API with Authorization header
          const response = await axios.get("http://localhost:8080/api/aggregator/inventory", {
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
        axios.get("http://localhost:8080/api/items/inventory", {
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
        axios.get("http://localhost:8080/api/suppliers", {
          xsrfCookieName: "next-auth.csrf-token",
          headers: {
            //@ts-ignore
            Authorization: `Bearer ${session.accessToken}`,
          },
        }).then(result => {
          // @ts-ignore
          setSuppliers(result.data);
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
  }, [session, status]); // Run effect only when session or status changes

  // Loading state
  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner
  }

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
        sx={(theme) => ({ color: '#fff', zIndex: 9999 })}
        open={backdropSave}
      >
        <CircularProgress color="inherit" />&nbsp; Saving...
      </Backdrop>
      <h1>Inventory Dashboard</h1>
      <p>Management Board</p>
      <br />
      <Button variant="contained" startIcon={<i className={"ri-add-circle-line"}></i>}
              color="info" onClick={() => setOpen(true)}>New Entry / Exit</Button>
      <br /><br />
      {/* Pass fetched data to child components */}
      {statistics && <LogisticsStatisticsCardEvolved data={statistics} />}
      <br />
      <InventoryTable />

      <Dialog maxWidth={"md"} fullWidth={true} onClose={handleDialogClose} open={open}>
        <DialogTitle>
          New Entry/Exit on Inventory (Manual)
          <IconButton
            aria-label='close'
            onClick={handleClose}
            className='absolute top-2.5 right-2.5 text-[var(--mui-palette-grey-500)]'>
            <i className='ri-close-line' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText className='mbe-3'>
            To add a new manual entry/exit on inventory, fill out below.
          </DialogContentText>
          <br/>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <ItemDropdown availableItems={availableItems} onItemSelect={onItemSelect}/>
            </Grid>
            <Grid hidden={itemBrand == ""} item xs={12} md={6}>
              <h4>Item Details</h4>
              <p><strong>Brand:</strong> {itemBrand}</p>
              <p><strong>Description:</strong> {itemDescription}</p>
            </Grid>
          </Grid>
          <br/>
          <Grid container spacing={6}>
            <Grid item xs={12} md={2}>
              <TextField required onChange={handleTextFieldChange} fullWidth id='quantity' type={"number"}
                         label='Quantity'/>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl>
                <InputLabel htmlFor='icons-adornment-cost-price'>Cost Price</InputLabel>
                <OutlinedInput
                  onChange={handleTextFieldChange}
                  label='Cost Price'
                  id='icons-adornment-cost-price'
                  endAdornment={<InputAdornment position='end'>€</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <UnitDropdown units={units} onItemSelect={onUnitSelect}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth onChange={handleTextFieldChange} id='batch' autoCapitalize={"on"} type={"text"}
                         label='Batch'/>
            </Grid>
          </Grid>
          <br/>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <SupplierDropdown suppliers={suppliers} onItemSelect={onSupplierSelect}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <WarehouseDropdown warehouses={warehouses} onItemSelect={onWarehouseSelect}/>
            </Grid>
          </Grid>
          <br/>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} onChange={handleTextFieldChange} id='notes' label={"Notes"}/>
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
                    value={date}
                    format={"DD-MM-YYYY"}
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
          <Button onClick={handleSave} variant='contained' color='success'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;
