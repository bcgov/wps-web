import { makeStyles } from '@material-ui/core/styles'

const currLineColor = 'green'
export const readingTempDotColor = '#ff1212'
export const readingRHDotColor = '#196aff'
export const modelTempDotColor = '#ff6984'
export const modelRHDotColor = '#6198ff'
export const biasModelTempDotColor = '#aa0000'
export const biasModelRHDotColor = '#0000aa'
export const modelSummaryTempAreaColor = '#ff96aa'
export const modelSummaryRHAreaColor = '#94b9ff'
export const highResModelTempDotColor = '#ff2b52'
export const highResModelRHDotColor = '#3079ff'
export const highResModelSummaryTempAreaColor = '#ff8a9f'
export const highResModelSummaryRHAreaColor = '#80acff'
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
      fill: readingTempDotColor,
      cursor: 'pointer'
    },
    '& .readingTempPath': {
      stroke: readingTempDotColor
    },
    '& .readingRHDot': {
      stroke: readingRHDotColor,
      fill: readingTempDotColor,
      cursor: 'pointer'
    },
    '& .readingRHPath': {
      stroke: readingRHDotColor
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
    '& .modelTempPath': {
      stroke: modelTempDotColor
    },
    '& .modelRHDot': {
      stroke: modelRHDotColor,
      fill: 'none',
      cursor: 'pointer'
    },
    '& .modelRHPath': {
      stroke: modelRHDotColor
    },
    '& .biasAdjustedModelTempDot': {
      stroke: biasModelTempDotColor,
      fill: 'none',
      cursor: 'pointer'
    },
    '& .biasAdjustedModelTempPath': {
      stroke: biasModelTempDotColor
    },
    '& .biasAdjustedModelRHDot': {
      stroke: biasModelRHDotColor,
      fill: 'none',
      cursor: 'pointer'
    },
    '& .biasAdjustedModelRHPath': {
      stroke: biasModelRHDotColor
    },
    '& .highResModelTempDot': {
      stroke: highResModelTempDotColor,
      fill: 'none',
      cursor: 'pointer'
    },
    '& .highResModelTempPath': {
      stroke: highResModelTempDotColor
    },
    '& .highResModelRHDot': {
      stroke: highResModelRHDotColor,
      fill: 'none',
      cursor: 'pointer'
    },
    '& .highResModelRHPath': {
      stroke: highResModelRHDotColor
    },
    '& .highResModelSummaryTempArea': {
      stroke: highResModelSummaryTempAreaColor,
      strokeWidth: 1,
      fill: highResModelSummaryTempAreaColor,
      opacity: 0.5
    },
    '& .highResModelSummaryRHArea': {
      stroke: highResModelSummaryRHAreaColor,
      strokeWidth: 1,
      fill: highResModelSummaryRHAreaColor,
      opacity: 0.5
    },
    '& .forecastTempDot': {
      stroke: forecastTempDotColor,
      fill: 'none',
      cursor: 'pointer'
    },
    '& .forecastRHDot': {
      stroke: forecastRHDotColor,
      fill: 'none',
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
