'use client'

import axios from "axios";
import LogisticsStatisticsCardEvolved from "@/app/(dashboard)/home/LogisticsStatisticsCardEvolved";
import InventoryTable from "@/app/(dashboard)/home/InventoryTable";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const Page = () => {
  const { data: session, status } = useSession(); // Get session and status
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warehouse, setWarehouse] = useState("Default")

  useEffect(() => {
    // Ensure session is loaded and available
    //@ts-ignore
    if (status === "authenticated" && session?.accessToken) {
      const fetchData = async () => {
        try {
          // Fetch data from API with Authorization header
          const response = await axios.get("http://localhost:8080/api/aggregator", {
            headers: {
              //@ts-ignore
              Authorization: `Bearer ${session.accessToken}`, // Use template literals
            },
          });

          setStatistics(response.data);
          setLoading(false); // Done loading
        } catch (err) {
          // @ts-ignore
          setError(err);
          setLoading(false); // Done loading even in case of error
        }
      };
      fetchData();
    } else if (status === "unauthenticated") {
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
      <h1>Inventory Dashboard</h1>
      <p>Management Board</p>
      <FormControl variant="standard" sx={{ m: 2, minWidth: 250 }}>
        <InputLabel id="demo-simple-select-standard-label">Selected Warehouse</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={warehouse}
          label="Warehouse"
        >
          <MenuItem value="Default">
            <em>Default</em>
          </MenuItem>
        </Select>
      </FormControl>
      <br />
      <br />

      {/* Pass fetched data to child components */}
      {statistics && <LogisticsStatisticsCardEvolved data={statistics} />}
      <br />
      <InventoryTable />
    </div>
  );
};

export default Page;
