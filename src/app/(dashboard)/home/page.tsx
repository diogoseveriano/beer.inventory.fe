import type {
  CardStatsHorizontalWithBorderPropsWithMoney
} from "@/types/pages/widgetTypes";
import LogisticsStatisticsCardEvolved from "@/app/(dashboard)/home/LogisticsStatisticsCardEvolved";
import InventoryTable from "@/app/(dashboard)/home/InventoryTable";

const statistics : CardStatsHorizontalWithBorderPropsWithMoney[]  = [
  {
    title: "Inventory Items",
    stats: 0,
    avatarIcon: "ri-box-1-fill",
    color: "primary"
  },
  {
    title: "(Stock) Finished Products",
    stats: 0,
    avatarIcon: "ri-beer-line",
    color: "success"
  },
  {
    title: "Purchase Orders (Pendind Delivery)",
    stats: 0,
    avatarIcon: "ri-ship-2-line",
    color: "info"
  },
  {
    title: "Inventory Alerts",
    stats: 0,
    avatarIcon: "ri-alert-line",
    color: "error"
  },
  {
    title: "Inventory Price",
    stats: 0.00,
    isMoney: true,
    avatarIcon: "ri-money-euro-circle-line",
    color: "info"
  }
];

const Page = () => {

  return (
    <div>
      <h1>Inventory Dashboard</h1>
      <p>Management Board</p>
      <p><span className={"text-xs"}>Last Update: 27/10/2024 18:54:10</span></p>
    <br />

      <LogisticsStatisticsCardEvolved data={statistics} />
      <br />
      <InventoryTable />

    </div>
  )
}

export default Page
