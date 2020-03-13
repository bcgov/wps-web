import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core'

import { StationSummaryResponse, YearRange } from 'api/percentileAPI'
import { FWI_VALUES_DECIMAL_POINT } from 'utils/constants'

const useStyles = makeStyles({
  graph: {
    width: 400
  }
})

interface Props {
  stationResponse: StationSummaryResponse
  yearRange: YearRange
}

export const PercentileStationResultTable = ({
  stationResponse,
  yearRange
}: Props) => {
  const { season, FFMC, BUI, ISI, years, station } = stationResponse
  const seasonRange = `${season.start_month}/${season.start_day} ~ ${season.end_month}/${season.end_day}`
  const yearsDisplay = years.join(', ')
  const classes = useStyles()

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Station Name</TableCell>
            <TableCell>
              {station.name} ({station.code})
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>FFMC</TableCell>
            <TableCell>{FFMC.toFixed(FWI_VALUES_DECIMAL_POINT)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <img
                className={classes.graph}
                src={`${process.env.REACT_APP_API_BASE_URL}/data/${yearRange.start}-${yearRange.end}/${station.code}_ffmc.png`}
                alt="FFMC"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>BUI</TableCell>
            <TableCell>{BUI.toFixed(FWI_VALUES_DECIMAL_POINT)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <img
                className={classes.graph}
                src={`${process.env.REACT_APP_API_BASE_URL}/data/${yearRange.start}-${yearRange.end}/${station.code}_bui.png`}
                alt="BUI"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ISI</TableCell>
            <TableCell>{ISI.toFixed(FWI_VALUES_DECIMAL_POINT)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <img
                className={classes.graph}
                src={`${process.env.REACT_APP_API_BASE_URL}/data/${yearRange.start}-${yearRange.end}/${station.code}_isi.png`}
                alt="ISI"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Season (mm/dd)</TableCell>
            <TableCell>{seasonRange}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Years</TableCell>
            <TableCell>{yearsDisplay}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Percentile (%)</TableCell>
            <TableCell>90</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
