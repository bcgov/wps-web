import { makeStyles } from '@material-ui/core/styles'

const currLineColor = 'green'
export const readingTempDotColor = '#ff6984'
export const readingRHDotColor = '#6198ff'
export const modelSummaryTempAreaColor = '#ff96aa'
export const modelSummaryRHAreaColor = '#94b9ff'
export const modelTempDotColor = '#ff143f'
export const modelRHDotColor = '#1768ff'
export const forecastTempDotColor = '#f23bff'
export const forecastRHDotColor = '#7a2eff'
const forecastSummaryTempLineColor = forecastTempDotColor
const forecastSummaryRHLineColor = forecastRHDotColor

export const useStyles = makeStyles({
  // Give styling through classes for svg elements
  root: {
    paddingBottom: 15,
    '& .xAxisLabel': {
      textAnchor: 'start',
      font: '9px sans-serif'
    },
    '& .yAxisLabel': {
      textAnchor: 'middle',
      font: '9px sans-serif'
    },
    '& .currLine': {
      strokeWidth: 1,
      stroke: currLineColor,
      strokeDasharray: '4,4'
    },
    '& .currLabel': {
      font: '9px sans-serif',
      fill: currLineColor
    },
    '& .tooltipCursor': {
      strokeWidth: 1,
      stroke: 'gray',
      strokeDasharray: '1,1',
      opacity: 0
    },
    '& .tooltip': {
      pointerEvents: 'none',
      font: '8.5px sans-serif',

      '&--hidden': {
        display: 'none'
      }
    },
    '& .readingTempDot': {
      stroke: readingTempDotColor,
      fill: 'none',
      cursor: 'pointer'
    },
    '& .readingRHDot': {
      stroke: readingRHDotColor,
      fill: 'none',
      cursor: 'pointer'
    },
    '& .modelSummaryTempArea': {
      stroke: modelSummaryTempAreaColor,
      strokeWidth: 1,
      fill: modelSummaryTempAreaColor,
      opacity: 0.5
    },
    '& .modelSummaryRHArea': {
      stroke: modelSummaryRHAreaColor,
      strokeWidth: 1,
      fill: modelSummaryRHAreaColor,
      opacity: 0.5
    },
    '& .modelTempDot': {
      stroke: modelTempDotColor,
      fill: 'none',
      cursor: 'pointer'
    },
    '& .modelRHDot': {
      stroke: modelRHDotColor,
      fill: 'none',
      cursor: 'pointer'
    },
    '& .forecastTempDot, & .pastForecastTempDot': {
      stroke: forecastTempDotColor,
      fill: forecastTempDotColor,
      cursor: 'pointer'
    },
    '& .forecastRHDot, & .pastForecastRHDot': {
      stroke: forecastRHDotColor,
      fill: forecastRHDotColor,
      cursor: 'pointer'
    },
    '& .forecastSummaryTempLine': {
      stroke: forecastSummaryTempLineColor,
      strokeWidth: 1.5,
      opacity: 0.8
    },
    '& .forecastSummaryRHLine': {
      stroke: forecastSummaryRHLineColor,
      strokeWidth: 1.5,
      opacity: 0.8
    }
  }
})
