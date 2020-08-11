import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

import { HistoricModel as _HistoricModel, ModelValue } from 'api/modelAPI'
import { ReadingValue } from 'api/readingAPI'
import { formatDateInPDT } from 'utils/date'
import { useStyles } from 'features/fireWeather/components/TempRHGraph.styles'
import { getNearestBasedOnDate, formatDateInMonthAndDay, storeDaysLookup } from 'utils/d3'
import { NoonForecastValue } from 'api/forecastAPI'

interface WeatherValue {
  date: Date
  temp?: number
  rh?: number
  modelTemp?: number
  modelRH?: number
  forecastTemp?: number
  forecastRH?: number
}
type HistoricModel = Omit<_HistoricModel, 'datetime'> & { date: Date }

interface Props {
  readingValues: ReadingValue[]
  modelValues: ModelValue[]
  historicModels: _HistoricModel[]
  forecastValues: NoonForecastValue[]
}

const TempRHGraph = ({
  readingValues: _readingValues = [],
  modelValues: _modelValues = [],
  historicModels: _historicModels = [],
  forecastValues: _forecastValues = []
}: Props) => {
  const classes = useStyles()
  const svgRef = useRef(null)

  useEffect(() => {
    if (svgRef.current) {
      /* Clear previous svg before rendering a new one*/
      d3.select(svgRef.current)
        .selectAll('*')
        .remove()

      /* Prepare for data */
      const daysLookup: { [k: string]: Date } = {} // will help to create the date label on x axis
      const allDates: Date[] = [] // will be used to determine x axis range
      const readingsForecastsAndModelsLookup: { [k: string]: WeatherValue } = {}
      const readingValues = _readingValues.map(d => {
        const date = storeDaysLookup(daysLookup, d.datetime)
        const reading = {
          date,
          temp: Number(d.temperature.toFixed(2)),
          rh: Math.round(d.relative_humidity)
        }
        readingsForecastsAndModelsLookup[d.datetime] = reading
        allDates.push(date)

        return reading
      })
      const modelValues = _modelValues.map(d => {
        const date = storeDaysLookup(daysLookup, d.datetime)
        const model = {
          date,
          modelTemp: Number(d.temperature.toFixed(2)),
          modelRH: Math.round(d.relative_humidity)
        }
        // combine with the existing reading value
        readingsForecastsAndModelsLookup[d.datetime] = {
          ...readingsForecastsAndModelsLookup[d.datetime],
          ...model
        }
        allDates.push(date)

        return model
      })
      const historicModels: HistoricModel[] = _historicModels.map(d => {
        const date = storeDaysLookup(daysLookup, d.datetime)
        allDates.push(date)

        return { ...d, date }
      })
      const forecastValues = _forecastValues.map(d => {
        const date = storeDaysLookup(daysLookup, d.datetime)
        const forecast = {
          date,
          forecastTemp: Number(d.temperature.toFixed(2)),
          forecastRH: Math.round(d.relative_humidity)
        }
        // combine with existing readings and models values
        readingsForecastsAndModelsLookup[d.datetime] = {
          ...readingsForecastsAndModelsLookup[d.datetime],
          ...forecast
        }
        allDates.push(date)

        return forecast
      })
      const readingForecastAndModelValues = Object.values(
        readingsForecastsAndModelsLookup
      ).sort((a, b) => a.date.valueOf() - b.date.valueOf())
      const minAndMaxDate = d3.extent(allDates) as [Date, Date]
      const xTickValues = Object.values(daysLookup)
        .sort((a, b) => a.valueOf() - b.valueOf()) // sort in ascending order
        .map((day, idx) => {
          if (idx === 0) {
            // Return the first day as it is
            return day
          }
          // Return the rest with 0h 0m 0s set
          return new Date(day).setHours(0, 0, 0)
        })

      /* Set the dimensions and margins of the graph */
      const margin = { top: 10, right: 40, bottom: 40, left: 40 }
      const widthValue = 600
      const heightValue = 150
      const width = widthValue - margin.left - margin.right
      const height = heightValue - margin.top - margin.bottom
      const svg = d3
        .select(svgRef.current)
        // Make it responsive: https://medium.com/@louisemoxy/a-simple-way-to-make-d3-js-charts-svgs-responsive-7afb04bc2e4b
        .attr('viewBox', `0 0 ${widthValue} ${heightValue}`)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

      /* Create scales for x and y axis */
      const xScale = d3
        .scaleTime()
        .domain(minAndMaxDate)
        .range([0, width])
      const yTempScale = d3
        .scaleLinear()
        .domain([-10, 45])
        .range([height, 0])
      const yRHScale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([height, 0])

      /* Render area and dots for temperature */
      const historicModelTempArea = d3
        .area<HistoricModel>()
        .curve(d3.curveNatural)
        .x(d => xScale(d.date))
        .y0(d => yTempScale(d.tmp_tgl_2_90th))
        .y1(d => yTempScale(d.tmp_tgl_2_5th))
      svg
        .append('path')
        .datum(historicModels)
        .attr('class', 'historicModelTempArea')
        .attr('d', historicModelTempArea)
        .attr('data-testid', 'historic-model-temp-area')
      svg
        .selectAll('.readingTempDot')
        .data(readingValues)
        .enter()
        .append('circle')
        .attr('class', 'readingTempDot')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yTempScale(d.temp))
        .attr('r', 1)
        .attr('data-testid', 'wx-data-reading-temp-dot')
      svg
        .selectAll('.modelTempDot')
        .data(modelValues)
        .enter()
        .append('circle')
        .attr('class', 'modelTempDot')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yTempScale(d.modelTemp))
        .attr('r', 1)
        .attr('data-testid', 'wx-data-model-temp-dot')
      svg
        .selectAll('.forecastTempDot')
        .data(forecastValues)
        .enter()
        .append('circle')
        .attr('class', 'forecastTempDot')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yTempScale(d.forecastTemp))
        .attr('r', 1)
        .attr('data-testid', 'wx-data-forecast-temp-dot')

      /* Render area and dots for RH */
      const historicModelRHArea = d3
        .area<HistoricModel>()
        .curve(d3.curveNatural)
        .x(d => xScale(d.date))
        .y0(d => yRHScale(d.rh_tgl_2_90th))
        .y1(d => yRHScale(d.rh_tgl_2_5th))
      svg
        .append('path')
        .datum(historicModels)
        .attr('class', 'historicModelRHArea')
        .attr('d', historicModelRHArea)
      svg
        .selectAll('.readingRHDot')
        .data(readingValues)
        .enter()
        .append('circle')
        .attr('class', 'readingRHDot')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yRHScale(d.rh))
        .attr('r', 1)
      svg
        .selectAll('.modelRHDot')
        .data(modelValues)
        .enter()
        .append('circle')
        .attr('class', 'modelRHDot')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yRHScale(d.modelRH))
        .attr('r', 1)
      svg
        .selectAll('.forecastRHDot')
        .data(forecastValues)
        .enter()
        .append('circle')
        .attr('class', 'forecastRHDot')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yRHScale(d.forecastRH))
        .attr('r', 1)

      /* Render the current time reference line */
      const currDate = new Date()
      const isCurrDateInXAxisRange =
        minAndMaxDate[0] &&
        minAndMaxDate[1] &&
        minAndMaxDate[0].valueOf() < currDate.valueOf() &&
        minAndMaxDate[1].valueOf() > currDate.valueOf()
      if (isCurrDateInXAxisRange) {
        const scaledCurrDate = xScale(currDate)
        svg
          .append('line')
          .attr('x1', scaledCurrDate)
          .attr('y1', 0)
          .attr('x2', scaledCurrDate)
          .attr('y2', height)
          .attr('class', 'currLine')
        svg
          .append('text')
          .attr('y', -12)
          .attr('x', scaledCurrDate)
          .attr('dy', '1em')
          .attr('dx', '-1em')
          .attr('class', 'currLabel')
          .text('Now')
      }

      /* Render the X & Y axis and labels */
      svg // X axis
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickFormat(formatDateInMonthAndDay)
            .tickValues(xTickValues)
        )
        .selectAll('text')
        .attr('y', 0)
        .attr('x', 0)
        .attr('dy', '1em')
        .attr('dx', '0.5em')
        .attr('transform', 'rotate(45)')
        .attr('class', 'xAxisLabel')

      // Y axis
      svg.append('g').call(d3.axisLeft(yTempScale).tickValues([-10, 5, 20, 35, 45]))
      svg
        .append('g')
        .attr('transform', `translate(${width}, 0)`)
        .call(d3.axisRight(yRHScale).tickValues([0, 25, 50, 75, 100]))

      svg // Temperature label
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1.3em')
        .attr('class', 'yAxisLabel')
        .text('Temp (°C)')
      svg // RH label
        .append('text')
        .attr('transform', 'rotate(-270)')
        .attr('y', 0 - width - margin.left)
        .attr('x', height / 2)
        .attr('dy', '1.3em')
        .attr('class', 'yAxisLabel')
        .text('RH (%)')

      /* Render tooltip and attach its listeners inspired by: https://observablehq.com/@d3/line-chart-with-tooltip */
      // High order function
      const createTooltipCallout = (dir?: 'right' | 'left') => (
        g: typeof svg,
        value: string
      ) => {
        if (!value) return g.attr('class', 'tooltip--hidden')

        g.attr('class', 'tooltip')

        const path = g
          .selectAll('path')
          .data([null])
          .join('path')
          .attr('fill', 'white')
          .attr('stroke', 'black')

        const text = g
          .selectAll('text')
          .data([null])
          .join('text')
          .call(txt =>
            txt
              .selectAll('tspan')
              .data((value + '').split(/\n/))
              .join('tspan')
              .attr('x', 0)
              .attr('y', (d, i) => `${i * 1.5}em`)
              .text(d => d)
          )

        // Don't show the tooltip if for some reason getBBox method doesn't exist
        if (!(text.node() as SVGSVGElement).getBBox) {
          return g.attr('class', 'tooltip--hidden')
        }

        const { y: textY, width: w, height: h } = (text.node() as SVGSVGElement).getBBox()
        const padding = 8
        const startX = 13
        let translateX = startX
        let HMove = startX + padding + w
        let MPointX = startX - padding
        const MPointY = textY - 2 * padding
        // Render the tooltip on the left side
        if (dir === 'left') {
          translateX = -w - startX
          HMove = -startX + padding
          MPointX = -startX - padding - w
        }
        text.attr('transform', `translate(${translateX}, ${textY})`)
        path.attr(
          'd',
          `M ${MPointX}, ${MPointY}
           H${HMove}
           v${h + 2 * padding}
           h-${w + 2 * padding}
           z
          `
        )
      }
      // Draw a rectangular that covers the whole svg space so that
      // the listener can react to user's mouseover in anywhere within the graph
      svg
        .append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', 'transparent')
        .attr('data-testid', 'wx-data-graph-background')
      const tooltipCursor = svg
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', height)
        .attr('class', 'tooltipCursor')
      const tooltip = svg.append('g')
      svg.on('touchmove mousemove', function() {
        const mx = d3.mouse(this)[0]
        const invertedDate = xScale.invert(mx)
        const nearest = getNearestBasedOnDate(invertedDate, readingForecastAndModelValues)
        if (!nearest) return // couldn't find the nearest, so don't render the tooltip
        const nearestX = xScale(nearest.date)
        const whichDirection = width / 2 > nearestX ? 'right' : 'left'
        const tooltipText = Object.entries(nearest)
          .map(([key, value]) => {
            if (key === 'date') {
              return formatDateInPDT(value, 'h:mm a, dddd, MMM Do')
            } else if (key === 'temp') {
              return `Temp: ${value} (°C)`
            } else if (key === 'modelTemp') {
              return `Model Temp: ${value} (°C)`
            } else if (key === 'forecastTemp') {
              return `Forecast Temp: ${value} (°C)`
            } else if (key === 'rh') {
              return `RH: ${value} (%)`
            } else if (key === 'modelRH') {
              return `Model RH: ${value} (%)`
            } else if (key === 'forecastRH') {
              return `Forecast RH: ${value} (%)`
            }
            return ''
          })
          .join('\n') // new line after each text
        tooltip
          .attr('transform', `translate(${nearestX}, ${height / 3})`)
          .call(createTooltipCallout(whichDirection), tooltipText)
        tooltipCursor.attr('transform', `translate(${nearestX}, 0)`).style('opacity', 1)
      })
      svg.on('touchend mouseleave', () => {
        tooltip.call(createTooltipCallout(), null)
        tooltipCursor.style('opacity', 0)
      })
    }
  }, [classes.root, _readingValues, _modelValues, _historicModels, _forecastValues])

  return (
    <div className={classes.root}>
      <svg data-testid="wx-data-graph" ref={svgRef} />
    </div>
  )
}

export default React.memo(TempRHGraph)
