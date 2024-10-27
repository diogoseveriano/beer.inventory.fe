import LogisticsStatisticsCard from "@/app/(dashboard)/home/LogisticsStatisticsCard";
import type {CardStatsHorizontalWithBorderProps} from "@/types/pages/widgetTypes";

const statistics : CardStatsHorizontalWithBorderProps[]  = [
  {
    title: "Inventory Items",
    stats: 0,
    trendNumber: 0,
    avatarIcon: "ri-box-1-fill",
    color: "primary"
  },
  {
    title: "(Stock) Finished Products",
    stats: 0,
    trendNumber: 0,
    avatarIcon: "ri-beer-line",
    color: "success"
  },
  {
    title: "Purchase Orders (Pendind Delivery)",
    stats: 0,
    trendNumber: 0,
    avatarIcon: "ri-ship-2-line",
    color: "info"
  },
  {
    title: "Inventory Alerts",
    stats: 0,
    trendNumber: 0,
    avatarIcon: "ri-alert-line",
    color: "error"
  }
];

const Page = () => {

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Management Board</p>
      <p><span className={"text-xs"}>Last Update: 27/10/2024 18:54:10</span></p>
    <br />
      <LogisticsStatisticsCard data={statistics} />
    </div>
  )
}

export default Page
