import { makeStyles } from '@material-ui/core/styles'

const currLineColor = 'green'
const readingTempDotColor = '#ff6380'
const readingRHDotColor = '#5e97ff'
const modelSummaryTempAreaColor = '#ff91a5'
const modelSummaryRHAreaColor = '#87b1ff'
const modelTempDotColor = '#ff143f'
const modelRHDotColor = '#1768ff'
const forecastTempDotColor = '#ec03fc'
const forecastRHDotColor = '#5e03fc'
const forecastSummaryTempLineColor = '#ec03fc'
const forecastSummaryRHLineColor = '#5e03fc'

export const useStyles = makeStyles({
  // Give styling through classes for svg elements
  root: {
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
      strokeWidth: 1.5
    },
    '& .forecastSummaryRHLine': {
      stroke: forecastSummaryRHLineColor,
      strokeWidth: 1.5
    }
  }
})
