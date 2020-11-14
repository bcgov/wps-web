import React, { useRef, useEffect, useMemo } from 'react'
import * as d3 from 'd3'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import clsx from 'clsx'

import { ObservedValue } from 'api/observationAPI'
import * as d3Utils from 'utils/d3'
import { formatDateInPDT } from 'utils/date'
import { NoonForecastValue } from 'api/forecastAPI'
import { ToggleValues } from 'features/fireWeather/components/graphs/useGraphToggles'
import { PDT_UTC_OFFSET } from 'utils/constants'

const observedPrecipColor = '#a50b41'
const forecastPrecipColor = '#fb0058'

const useStyles = makeStyles({
  root: {
    paddingBottom: 15,

    '& .yAxisLabel': {
      textAnchor: 'middle',
      font: '9px sans-serif'
    },

    '& .tooltip': {
      pointerEvents: 'none',
      font: '8.5px sans-serif',

      '&__cursor': {
        strokeWidth: 1,
        stroke: 'gray',
        strokeDasharray: '1,1',
        opacity: 0
      },

      '&--hidden': {
        display: 'none'
      }
    },

    '& .precipLine': {
      '&__observed': {
        strokeWidth: 2.5,
        stroke: observedPrecipColor
      },

      '&__forecast': {
        strokeWidth: 2.5,
        stroke: forecastPrecipColor
      },

      '&--hidden': {
        visibility: 'hidden'
      }
    }
  }
})

interface PrecipValue {
  date: Date
  precip?: number
  forecastPrecip?: number
}

interface Props {
  toggleValues: ToggleValues
  observedValues: ObservedValue[]
  forecastValues: NoonForecastValue[]
}

/* Table layout constants */
const margin = { top: 10, right: 40, bottom: 50, left: 40 }
const svgWidth = 600
const svgHeight = 250
const chartWidth = svgWidth - margin.left - margin.right
const chartHeight = svgHeight - margin.top - margin.bottom

const PrecipGraph: React.FunctionComponent<Props> = ({
  toggleValues,
  observedValues,
  forecastValues
}: Props) => {
  const classes = useStyles()
  const svgRef = useRef<SVGSVGElement>(null)
  const utcOffset = PDT_UTC_OFFSET

  // useMemo will only recompute the memoized value when one of the dependencies has changed.
  // This optimization helps to avoid expensive calculations on every render.
  const { xDomain, xTickValues, observedPrecips, forecastPrecips } = useMemo(() => {
    const datesFromAllSources: Date[] = []

    const aggreObservedPrecips: { [k: string]: number } = {}
    observedValues.forEach(({ datetime, precipitation: precip }) => {
      const date = formatDateInPDT(datetime, 'YYYY-MM-DD')
      if (!aggreObservedPrecips[date]) {
        aggreObservedPrecips[date] = Number(precip)
      } else {
        aggreObservedPrecips[date] = aggreObservedPrecips[date] + Number(precip)
      }
    })

    const observedPrecips = Object.entries(aggreObservedPrecips).map(
      ([formattedDate, totalPrecip]) => {
        const date = moment(formattedDate)
          .utc()
          .set({ hour: Math.abs(utcOffset), minute: 0 })
          .toDate()
        datesFromAllSources.push(date)

        return {
          date,
          value: Number(totalPrecip.toFixed(2))
        }
      }
    )

    const forecastPrecips = forecastValues.map(({ datetime, total_precipitation }) => {
      const date = moment(datetime)
        .utc()
        .set({ hour: Math.abs(utcOffset) })
        .toDate()
      datesFromAllSources.push(date)

      return {
        date,
        value: Number(total_precipitation.toFixed(2))
      }
    })

    const currDate = new Date()
    const pastDate = moment(currDate)
      .subtract(5, 'days')
      .toDate()
    const [minDate, maxDate] = d3.extent(datesFromAllSources)
    let d1 = minDate || pastDate
    let d2 = maxDate || currDate
    d1 = moment(d1)
      .subtract(6, 'hours')
      .toDate()
    d2 = moment(d2)
      .add(6, 'hours')
      .toDate()
    const xDomain: [Date, Date] = [d1, d2]

    return {
      xDomain,
      xTickValues: d3Utils.getTickValues(xDomain, utcOffset, false),
      observedPrecips,
      forecastPrecips
    }
  }, [utcOffset, observedValues, forecastValues])

  // Effect hook for displaying graphics
  useEffect(() => {
    if (svgRef.current) {
      /* Clear previous graphics before rendering new ones */
      d3.select(svgRef.current)
        .selectAll('*')
        .remove()

      const svg = d3
        .select(svgRef.current)
        .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)

      const chart = svg
        .append('g')
        .attr('class', 'chart')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

      const context = svg // svg group for Y axis and its labels
        .append('g')
        .attr('class', 'context')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

      /* Create scales for x and y axes */
      const xScale = d3
        .scaleTime()
        .domain(xDomain)
        .range([0, chartWidth])
      const xScaleCopy = xScale.copy()
      const yScale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([chartHeight, 0])

      observedPrecips.map(precip =>
        d3Utils.drawVerticalLine({
          svg: chart,
          className: 'precipLine__observed',
          xScale: xScaleCopy,
          x: xScale(precip.date) - 2,
          y1: yScale(precip.value),
          y2: yScale(0)
        })
      )

      forecastPrecips.map(precip =>
        d3Utils.drawVerticalLine({
          svg: chart,
          className: 'precipLine__forecast',
          xScale: xScaleCopy,
          x: xScale(precip.date) + 2,
          y1: yScale(precip.value),
          y2: yScale(0)
        })
      )

      /* Render the X & Y axis and labels */
      chart
        .append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickFormat(d3Utils.formatDateInMonthAndDay)
            .tickValues(xTickValues)
        )
      context.append('g').call(d3.axisLeft(yScale).ticks(5))
      context // Temperature label
        .append('text')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - chartHeight / 2)
        .attr('dy', '1.3em')
        .attr('dx', '0')
        .attr('class', 'yAxisLabel')
        .text('Precipitation (mm/cm)')
        .attr('transform', 'rotate(-90)')
    }
  }, [xDomain, xTickValues, observedPrecips, forecastPrecips])

  const precipsOfInterest = useMemo(() => {
    const precipsByDatetime: { [date: string]: PrecipValue } = {}
    const { showObservations, showForecasts } = toggleValues

    showObservations &&
      observedPrecips.forEach(({ date, value }) => {
        precipsByDatetime[date.toISOString()] = { date, precip: value }
      })

    showForecasts &&
      forecastPrecips.forEach(({ date, value }) => {
        precipsByDatetime[date.toISOString()] = {
          ...precipsByDatetime[date.toISOString()],
          date,
          forecastPrecip: value
        }
      })

    return Object.values(precipsByDatetime)
  }, [toggleValues, observedPrecips, forecastPrecips])

  // Effect hook for adding/updating tooltip
  useEffect(() => {
    const svgElement = svgRef.current
    if (svgElement) {
      const svg = d3.select(svgElement)
      svg.select('.tooltip').remove()
      svg.select('.tooltip__cursor').remove()
      svg.select('.tooltip__background').remove()

      const xScale = d3
        .scaleTime()
        .domain(xDomain)
        .range([0, chartWidth])

      d3Utils.addTooltipListener({
        svg: svg.select('.chart'),
        xScale,
        width: chartWidth,
        height: chartHeight,
        data: precipsOfInterest,
        textTestId: 'precip-tooltip-text',
        bgdTestId: 'precip-graph-background',
        getInnerText: ([k, value]) => {
          const key = k as keyof PrecipValue
          if (key === 'date' && value instanceof Date) {
            return `${formatDateInPDT(value, 'h:mm a, ddd, MMM Do')} (PDT, UTC-7)`
          } else if (typeof value === 'number') {
            switch (key) {
              case 'precip':
                return `Observed Precip: ${value} (mm/cm)`
              case 'forecastPrecip':
                return `Forecast Precip: ${value} (mm/cm)`
              default:
                return ''
            }
          }

          return ''
        }
      })
    }

    return () => {
      if (svgElement) {
        // clean up the event listeners
        const svg = d3.select(svgElement)
        svg.on('touchmove mousemove', null)
        svg.on('touchend mouseleave', null)
      }
    }
  }, [xDomain, precipsOfInterest])

  // Effect hooks for showing/hiding graphics
  const { showObservations, showForecasts } = toggleValues
  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current)
      svg
        .selectAll('.precipLine__observed')
        .attr(
          'class',
          clsx('precipLine__observed', !showObservations && 'precipLine--hidden')
        )
    }
  }, [showObservations])
  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current)
      svg
        .selectAll('.precipLine__forecast')
        .attr(
          'class',
          clsx('precipLine__forecast', !showForecasts && 'precipLine--hidden')
        )
    }
  }, [showForecasts])

  return (
    <div className={classes.root}>
      <svg data-testid="precip-graph" ref={svgRef} />
    </div>
  )
}

export default React.memo(PrecipGraph)