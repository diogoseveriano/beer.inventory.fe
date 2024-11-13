'use client'

import {useEffect, useState} from "react";

import axios from "axios";

import { useSession } from "next-auth/react";

import Button from "@mui/material/Button";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Grid from "@mui/material/Grid";

import TextField from "@mui/material/TextField";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ItemDropdown from "@/app/(dashboard)/inventory/ItemDropdown";
import InventoryTable from "@/app/(dashboard)/inventory/InventoryTable";
import LogisticsStatisticsCardEvolved from "@/app/(dashboard)/inventory/LogisticsStatisticsCardEvolved";
import UnitDropdown from "@/app/(dashboard)/inventory/UnitDropdown";
import SupplierDropdown from "@/app/(dashboard)/inventory/SupplierDropdown";
import WarehouseDropdown from "@/app/(dashboard)/inventory/WarehouseDropdown";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";


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

  const handleClose = (value: string) => {
    setOpen(false)
  }

  const handleDialogClose = () => {
    setItemDescription("")
    setItemBrand("")
    setOpen(false)
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

    console.log(data);

    axios.post("http://localhost:8080/api/inventory/create", data, {
      xsrfCookieName: "next-auth.csrf-token",
      headers: {
        //@ts-ignore
        Authorization: `Bearer ${session.accessToken}`,
      },
    }).then(result => {
      console.log(result)
    });
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
        } catch (err) {
          // @ts-ignore
          setError(err);
          setLoading(false);
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
      setLoading(false); // Set loading to false if user is not authenticated
      // @ts-ignore
      setError(new Error("User is not authenticated"));
    }
  }, [session, status, statistics]); // Run effect only when session or status changes

  // Loading state
  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner
  }

  return (
    <div>
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
        <DialogTitle>New Entry/Exit on Inventory (Manual)</DialogTitle>
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
              <TextField fullWidth onChange={handleTextFieldChange} id='costPrice' type={"number"} label='Cost Price'/>
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
            Cancel
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
