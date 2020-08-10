import { makeStyles } from '@material-ui/core/styles'

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
      stroke: 'green',
      strokeDasharray: '4,4'
    },
    '& .currLabel': {
      font: '9px sans-serif',
      fill: 'green'
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
      stroke: 'crimson',
      fill: 'none',
      cursor: 'pointer'
    },
    '& .readingRHDot': {
      stroke: 'royalblue',
      fill: 'none',
      cursor: 'pointer'
    },
    '& .historicModelTempArea': {
      fill: '#ff91a5',
      opacity: 0.5
    },
    '& .historicModelRHArea': {
      fill: '#87b1ff',
      opacity: 0.5
    },
    '& .modelTempDot': {
      stroke: '#fc6f03',
      fill: 'none',
      cursor: 'pointer'
    },
    '& .modelRHDot': {
      stroke: '#03a1fc',
      fill: 'none',
      cursor: 'pointer'
    }
  },
  title: {
    paddingBottom: 6
  },
  switchWrapper: {
    marginLeft: -5
  },
  switchLabel: {
    marginLeft: 2
  }
})
