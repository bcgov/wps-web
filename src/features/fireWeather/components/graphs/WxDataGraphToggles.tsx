import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

const useStyles = makeStyles({
  formControlLabel: {
    marginLeft: -5
  },
  label: {
    marginLeft: 2
  }
})

interface Props {
  noReadings: boolean
  showReadings: boolean
  setShowReadings: (checked: boolean) => void
  noModels: boolean
  showModels: boolean
  setShowModels: (checked: boolean) => void
  noModelSummaries: boolean
  showModelSummaries: boolean
  setShowModelSummaries: (checked: boolean) => void
  noForecasts: boolean
  showForecasts: boolean
  setShowForecasts: (checked: boolean) => void
  noPastForecasts: boolean
  showPastForecasts: boolean
  setShowPastForecasts: (checked: boolean) => void
}

const WxDataToggles = ({
  noReadings,
  showReadings,
  setShowReadings,
  noModels,
  showModels,
  setShowModels,
  noModelSummaries,
  showModelSummaries,
  setShowModelSummaries,
  noForecasts,
  showForecasts,
  setShowForecasts,
  noPastForecasts,
  showPastForecasts,
  setShowPastForecasts
}: Props) => {
  const classes = useStyles()

  return (
    <FormGroup row>
      <FormControlLabel
        className={classes.formControlLabel}
        control={
          <Switch
            name="showReadings"
            data-testid="wx-graph-reading-toggle"
            checked={showReadings}
            disabled={noReadings}
            size="small"
            onChange={(_, checked) => {
              setShowReadings(checked)
            }}
          />
        }
        label={
          <Typography className={classes.label} variant="body2">
            Reading from Station
          </Typography>
        }
      />
      <FormControlLabel
        className={classes.formControlLabel}
        control={
          <Switch
            name="showModelSummaries"
            data-testid="wx-graph-model-summary-toggle"
            checked={showModelSummaries}
            disabled={noModelSummaries}
            size="small"
            onChange={(_, checked) => {
              setShowModelSummaries(checked)
            }}
          />
        }
        label={
          <Typography className={classes.label} variant="body2">
            Historic Model
          </Typography>
        }
      />
      <FormControlLabel
        className={classes.formControlLabel}
        control={
          <Switch
            name="showPastForecasts"
            data-testid="wx-graph-forecast-summary-toggle"
            checked={showPastForecasts}
            disabled={noPastForecasts}
            size="small"
            onChange={(_, checked) => {
              setShowPastForecasts(checked)
            }}
          />
        }
        label={
          <Typography className={classes.label} variant="body2">
            Historic Noon Forecast
          </Typography>
        }
      />
      <FormControlLabel
        className={classes.formControlLabel}
        control={
          <Switch
            name="showModels"
            data-testid="wx-graph-model-toggle"
            checked={showModels}
            disabled={noModels}
            size="small"
            onChange={(_, checked) => {
              setShowModels(checked)
            }}
          />
        }
        label={
          <Typography className={classes.label} variant="body2">
            Global Model
          </Typography>
        }
      />
      <FormControlLabel
        className={classes.formControlLabel}
        control={
          <Switch
            name="showForecasts"
            data-testid="wx-graph-forecast-toggle"
            checked={showForecasts}
            disabled={noForecasts}
            size="small"
            onChange={(_, checked) => {
              setShowForecasts(checked)
            }}
          />
        }
        label={
          <Typography className={classes.label} variant="body2">
            Noon Forecast
          </Typography>
        }
      />
    </FormGroup>
  )
}

export default React.memo(WxDataToggles)
