// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import type {
  CardStatsHorizontalWithBorderPropsWithMoney
} from "@/types/pages/widgetTypes";
import HorizontalWithBorderWithoutLastWeek from "@components/card-statistics/HorizontalWithBorderWithoutLastWeek";

const LogisticsStatisticsCardEvolved = ({ data }: { data?: CardStatsHorizontalWithBorderPropsWithMoney[] }) => {
  return (
    data && (
      <Grid container spacing={6}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <HorizontalWithBorderWithoutLastWeek {...item} />
          </Grid>
        ))}
      </Grid>
    )
  )
}

export default LogisticsStatisticsCardEvolved
