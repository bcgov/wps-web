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
  noForecasts: boolean
  showForecasts: boolean
  setShowForecasts: (checked: boolean) => void
}

const WxDataToggles = ({
  noReadings,
  showReadings,
  setShowReadings,
  noModels,
  showModels,
  setShowModels,
  noForecasts,
  showForecasts,
  setShowForecasts
}: Props) => {
  const classes = useStyles()

  return (
    <FormGroup row>
      <FormControlLabel
        className={classes.formControlLabel}
        control={
          <Switch
            name="showReadings"
            data-testid="wx-data-reading-toggle"
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
            Weather Readings
          </Typography>
        }
      />
      <FormControlLabel
        className={classes.formControlLabel}
        control={
          <Switch
            name="showModels"
            data-testid="wx-data-model-toggle"
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
            Weather Model
          </Typography>
        }
      />
      <FormControlLabel
        className={classes.formControlLabel}
        control={
          <Switch
            name="showForecasts"
            data-testid="wx-data-forecast-toggle"
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
            Noon Forecasts
          </Typography>
        }
      />
    </FormGroup>
  )
}

export default React.memo(WxDataToggles)
