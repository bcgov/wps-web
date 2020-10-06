import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

import { ReadingValue } from 'api/readingAPI'
import { ModelSummary as _ModelSummary, ModelValue } from 'api/modelAPI'
import { ForecastSummary as _ForecastSummary, NoonForecastValue } from 'api/forecastAPI'
import { formatDateInPDT } from 'utils/date'
import * as styles from 'features/fireWeather/components/graphs/TempRHGraph.styles'
import * as d3Utils from 'utils/d3'

interface WeatherValue {
  date: Date
  temp?: number
  rh?: number
  modelTemp?: number
  modelRH?: number
  forecastTemp?: number
  forecastRH?: number
  historicModelTemp?: number
  historicModelRH?: number
}
type ModelSummary = Omit<_ModelSummary, 'datetime'> & { date: Date }
type ForecastSummary = Omit<_ForecastSummary, 'datetime'> & { date: Date }

interface Props {
  readingValues: ReadingValue[]
  modelValues: ModelValue[]
  modelSummaries: _ModelSummary[]
  forecastValues: NoonForecastValue[]
  pastForecastValues: NoonForecastValue[]
  forecastSummaries: _ForecastSummary[]
  recentHistoricModelValues: ModelValue[]
  biasAdjustedModelValues: ModelValue[]
}

const TempRHGraph: React.FunctionComponent<Props> = ({
  readingValues: _readingValues,
  modelValues: _modelValues,
  modelSummaries: _modelSummaries,
  forecastValues: _forecastValues,
  pastForecastValues: _pastForecastValues,
  forecastSummaries: _forecastSummaries,
  recentHistoricModelValues: _recentHistoricModelValues,
  biasAdjustedModelValues: _biasAdjustedModelValues
}: Props) => {
  const classes = styles.useStyles()
  const svgRef = useRef(null)

  useEffect(() => {
    if (svgRef.current) {
      /* Clear previous svg before rendering a new one */
      d3.select(svgRef.current)
        .selectAll('*')
        .remove()

      /* Prepare for data */
      const daysLookup: { [k: string]: Date } = {} // will help to create the date label on x axis
      const allDates: Date[] = [] // will be used to determine x axis range
      const weatherValueByDatetime: { [k: string]: WeatherValue } = {}
      const readingValues = _readingValues
        .filter(d => d.temperature || d.relative_humidity)
        .map(d => {
          const date = d3Utils.storeDaysLookup(daysLookup, d.datetime)
          const reading = {
            date,
            temp: d.temperature ? Number(d.temperature.toFixed(2)) : NaN,
            rh: d.relative_humidity ? Math.round(d.relative_humidity) : NaN
          }
          weatherValueByDatetime[d.datetime] = reading
          allDates.push(date)

          return reading
        })
      const modelValues = _modelValues
        .filter(d => d.temperature || d.relative_humidity)
        .map(d => {
          const date = d3Utils.storeDaysLookup(daysLookup, d.datetime)
          const model = {
            date,
            modelTemp: d.temperature ? Number(d.temperature.toFixed(2)) : NaN,
            modelRH: d.relative_humidity ? Math.round(d.relative_humidity) : NaN
          }
          // combine with the existing reading value
          weatherValueByDatetime[d.datetime] = {
            ...weatherValueByDatetime[d.datetime],
            ...model
          }
          allDates.push(date)

          return model
        })
      const modelSummaries: ModelSummary[] = _modelSummaries.map(d => {
        const date = d3Utils.storeDaysLookup(daysLookup, d.datetime)
        allDates.push(date)

        return { ...d, date }
      })
      const recentHistoricModelValues = _recentHistoricModelValues
        .filter(d => d.temperature || d.relative_humidity)
        .map(d => {
          const date = d3Utils.storeDaysLookup(daysLookup, d.datetime)
          const historicModel = {
            date,
            historicModelTemp: d.temperature ? Number(d.temperature.toFixed(2)) : NaN,
            historicModelRH: d.relative_humidity ? Math.round(d.relative_humidity) : NaN
          }
          // combine with existing weather values
          weatherValueByDatetime[d.datetime] = {
            ...weatherValueByDatetime[d.datetime],
            ...historicModel
          }
          allDates.push(date)

          return historicModel
        })
      const biasAdjustedModelValues = _biasAdjustedModelValues
        .filter(d => d.bias_adjusted_temperature || d.bias_adjusted_relative_humidity)
        .map(d => {
          const date = d3Utils.storeDaysLookup(daysLookup, d.datetime)
          const biasAdjustedModel = {
            date,
            biasAdjustedModelTemp: d.bias_adjusted_temperature
              ? Number(d.bias_adjusted_temperature.toFixed(2))
              : NaN,
            biasAdjustedModelRH: d.bias_adjusted_relative_humidity
              ? Math.round(d.bias_adjusted_relative_humidity)
              : NaN
          }
          // combines with existing weather values
          weatherValueByDatetime[d.datetime] = {
            ...weatherValueByDatetime[d.datetime],
            ...biasAdjustedModel
          }
          allDates.push(date)

          return biasAdjustedModel
        })
      const forecastValues = _forecastValues.map(d => {
        const date = d3Utils.storeDaysLookup(daysLookup, d.datetime)
        const forecast = {
          date,
          forecastTemp: Number(d.temperature.toFixed(2)),
          forecastRH: Math.round(d.relative_humidity)
        }
        // combine with existing readings and models values
        weatherValueByDatetime[d.datetime] = {
          ...weatherValueByDatetime[d.datetime],
          ...forecast
        }
        allDates.push(date)

        return forecast
      })
      const pastForecastValues = _pastForecastValues.map(d => {
        const date = d3Utils.storeDaysLookup(daysLookup, d.datetime)
        const pastForecast = {
          date,
          forecastTemp: Number(d.temperature.toFixed(2)),
          forecastRH: Math.round(d.relative_humidity)
        }
        // combine with existing readings and models values
        weatherValueByDatetime[d.datetime] = {
          ...weatherValueByDatetime[d.datetime],
          ...pastForecast
        }
        allDates.push(date)

        return pastForecast
      })
      const forecastSummaries: ForecastSummary[] = _forecastSummaries.map(d => {
        const date = d3Utils.storeDaysLookup(daysLookup, d.datetime)
        allDates.push(date)

        return { ...d, date }
      })
      // weather values without percentile summaries
      const weatherValues = Object.values(weatherValueByDatetime).sort(
        (a, b) => a.date.valueOf() - b.date.valueOf()
      )
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
      const margin = { top: 10, right: 40, bottom: 90, left: 40 }
      const widthValue = 600
      const heightValue = 300
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

      /* Render temp and rh model summary clouds */
      d3Utils.drawArea({
        svg,
        className: 'modelSummaryTempArea',
        datum: modelSummaries,
        x: d => xScale(d.date),
        y0: d => yTempScale(d.tmp_tgl_2_90th),
        y1: d => yTempScale(d.tmp_tgl_2_5th),
        testId: 'model-summary-temp-area'
      })
      d3Utils.drawArea({
        svg,
        className: 'modelSummaryRHArea',
        datum: modelSummaries,
        x: d => xScale(d.date),
        y0: d => yRHScale(d.rh_tgl_2_90th),
        y1: d => yRHScale(d.rh_tgl_2_5th)
      })

      /* Render temp and rh hourly readings */
      d3Utils.drawDots({
        svg,
        className: 'readingTempDot',
        data: readingValues,
        cx: d => xScale(d.date),
        cy: d => yTempScale(d.temp),
        testId: 'hourly-reading-temp-dot'
      })
      d3Utils.drawDots({
        svg,
        className: 'readingRHDot',
        data: readingValues,
        cx: d => xScale(d.date),
        cy: d => yRHScale(d.rh)
      })

      /* Render temp and rh models */
      d3Utils.drawDots({
        svg,
        className: 'modelTempDot',
        data: modelValues,
        cx: d => xScale(d.date),
        cy: d => yTempScale(d.modelTemp),
        testId: 'model-temp-dot'
      })
      d3Utils.drawDots({
        svg,
        className: 'modelRHDot',
        data: modelValues,
        cx: d => xScale(d.date),
        cy: d => yRHScale(d.modelRH)
      })

      /* Render historic model temp and rh values */
      d3Utils.drawDots({
        svg,
        className: 'historicModelTempDot',
        data: recentHistoricModelValues,
        cx: d => xScale(d.date),
        cy: d => yTempScale(d.historicModelTemp),
        testId: 'historic-model-temp-dot'
      })
      d3Utils.drawDots({
        svg,
        className: 'historicModelRHDot',
        data: recentHistoricModelValues,
        cx: d => xScale(d.date),
        cy: d => yRHScale(d.historicModelRH)
      })

      /* Render bias adjusted model temp and rh values */
      d3Utils.drawDots({
        svg,
        className: 'biasAdjustedModelTempDot',
        data: biasAdjustedModelValues,
        cx: d => xScale(d.date),
        cy: d => yTempScale(d.biasAdjustedModelTemp),
        radius: 0.5,
        testId: 'bias-adjusted-model-temp-dot'
      })
      d3Utils.drawDots({
        svg,
        className: 'biasAdjustedModelRHDot',
        data: biasAdjustedModelValues,
        cx: d => xScale(d.date),
        cy: d => yRHScale(d.biasAdjustedModelRH),
        radius: 0.5,
        testId: 'bias-adjusted-model-rh-dot'
      })

      /* Render temp and rh noon forecasts */
      d3Utils.drawDots({
        svg,
        className: 'forecastTempDot',
        data: forecastValues,
        cx: d => xScale(d.date),
        cy: d => yTempScale(d.forecastTemp),
        testId: 'forecast-temp-dot'
      })
      d3Utils.drawDots({
        svg,
        className: 'forecastRHDot',
        data: forecastValues,
        cx: d => xScale(d.date),
        cy: d => yRHScale(d.forecastRH)
      })

      /* Render temp and rh past noon forecasts */
      d3Utils.drawDots({
        svg,
        className: 'pastForecastTempDot',
        data: pastForecastValues,
        cx: d => xScale(d.date),
        cy: d => yTempScale(d.forecastTemp),
        testId: 'forecast-temp-dot'
      })
      // Past forecasts temp min & max vertical lines
      forecastSummaries.forEach(forecast => {
        d3Utils.drawVerticalLine({
          svg,
          className: 'forecastSummaryTempLine',
          x: xScale(forecast.date),
          y1: yTempScale(forecast.tmp_min),
          y2: yTempScale(forecast.tmp_max),
          testId: 'forecast-summary-temp-line'
        })
      })
      d3Utils.drawDots({
        svg,
        className: 'pastForecastRHDot',
        data: pastForecastValues,
        cx: d => xScale(d.date),
        cy: d => yRHScale(d.forecastRH)
      })
      // Past forecasts rh min & max vertical lines
      forecastSummaries.forEach(forecast => {
        d3Utils.drawVerticalLine({
          svg,
          className: 'forecastSummaryRHLine',
          x: xScale(forecast.date),
          y1: yRHScale(forecast.rh_min),
          y2: yRHScale(forecast.rh_max)
        })
      })

      /* Render the current time reference line */
      const currDate = new Date()
      const isCurrDateInXAxisRange =
        minAndMaxDate[0] &&
        minAndMaxDate[1] &&
        minAndMaxDate[0].valueOf() < currDate.valueOf() &&
        minAndMaxDate[1].valueOf() > currDate.valueOf()
      if (isCurrDateInXAxisRange) {
        const scaledCurrDate = xScale(currDate)
        d3Utils.drawVerticalLine({
          svg,
          className: 'currLine',
          x: scaledCurrDate,
          y1: 0,
          y2: height
        })
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
            .tickFormat(d3Utils.formatDateInMonthAndDay)
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

      /* Render legends */
      let legendY = height + margin.bottom - 45
      let legendX = 0
      d3Utils.addLegend({
        svg,
        text: 'Reading Temp',
        color: styles.readingTempDotColor,
        fill: 'none',
        shapeX: legendX,
        shapeY: legendY,
        textX: legendX += 7,
        textY: legendY + 3
      })
      d3Utils.addLegend({
        svg,
        text: 'Reading RH',
        color: styles.readingRHDotColor,
        fill: 'none',
        shapeX: legendX += 78,
        shapeY: legendY,
        textX: legendX += 7,
        textY: legendY + 3
      })
      d3Utils.addLegend({
        svg,
        text: 'Forecast Temp',
        color: styles.forecastTempDotColor,
        shapeX: legendX += 67,
        shapeY: legendY,
        textX: legendX += 7,
        textY: legendY + 3
      })
      d3Utils.addLegend({
        svg,
        text: 'Forecast RH',
        color: styles.forecastRHDotColor,
        shapeX: legendX += 80,
        shapeY: legendY,
        textX: legendX += 7,
        textY: legendY + 3
      })
      d3Utils.addLegend({
        svg,
        text: 'Model Temp',
        color: styles.modelTempDotColor,
        fill: 'none',
        shapeX: legendX += 69,
        shapeY: legendY,
        textX: legendX += 7,
        textY: legendY + 3
      })
      d3Utils.addLegend({
        svg,
        text: 'Model RH',
        color: styles.modelRHDotColor,
        fill: 'none',
        shapeX: legendX += 70,
        shapeY: legendY,
        textX: legendX + 7,
        textY: legendY + 3
      })
      // New line
      legendX = 0
      legendY += 16
      d3Utils.addLegend({
        svg,
        shape: 'rect',
        text: 'Model Temp 5th - 90th percentiles',
        color: styles.modelSummaryTempAreaColor,
        shapeX: legendX - 2,
        shapeY: legendY - 4,
        textX: legendX += 11,
        textY: legendY + 3
      })
      d3Utils.addLegend({
        svg,
        shape: 'rect',
        text: 'Model RH 5th - 90th percentiles',
        color: styles.modelSummaryRHAreaColor,
        shapeX: legendX += 166,
        shapeY: legendY - 4,
        textX: legendX + 13,
        textY: legendY + 3
      })
      // New line
      legendX = 0
      legendY += 16
      d3Utils.addLegend({
        svg,
        text: 'Bias Adjusted Model Temp',
        color: styles.biasModelTempDotColor,
        fill: 'none',
        shapeX: legendX,
        shapeY: legendY,
        textX: legendX += 7,
        textY: legendY + 3,
        radius: 0.5
      })
      d3Utils.addLegend({
        svg,
        text: 'Bias Adjusted Model RH',
        color: styles.biasModelRHDotColor,
        fill: 'none',
        shapeX: legendX += 130,
        shapeY: legendY,
        textX: legendX + 7,
        textY: legendY + 3,
        radius: 0.5
      })

      /* Attach tooltip listener */
      d3Utils.addTooltipListener({
        svg,
        xScale,
        width,
        height,
        data: weatherValues,
        textTestId: 'temp-rh-tooltip-text',
        bgdTestId: 'temp-rh-graph-background',
        getInnerText: ([key, value]) => {
          if (key === 'date' && typeof value === 'object') {
            return `${formatDateInPDT(value, 'h:mm a, ddd, MMM Do')} (PDT, UTC-7)`
          } else if (typeof value === 'number') {
            let weatherValue: number | string = value
            if (isNaN(weatherValue)) {
              weatherValue = '-'
            }

            if (key === 'temp') {
              return `Temp: ${weatherValue} (°C)`
            } else if (key === 'modelTemp') {
              return `Model Temp: ${weatherValue} (°C)`
            } else if (key === 'forecastTemp') {
              return `Forecast Temp: ${weatherValue} (°C)`
            } else if (key === 'rh') {
              return `RH: ${weatherValue} (%)`
            } else if (key === 'modelRH') {
              return `Model RH: ${weatherValue} (%)`
            } else if (key === 'forecastRH') {
              return `Forecast RH: ${weatherValue} (%)`
            } else if (key === 'historicModelTemp') {
              return `Last issued Model Temp: ${weatherValue} (°C)`
            } else if (key === 'historicModelRH') {
              return `Last issued Model RH: ${weatherValue} (%)`
            } else if (key === 'biasAdjustedModelTemp') {
              return `Bias adjusted Temp: ${weatherValue} (°C)`
            } else if (key === 'biasAdjustedModelRH') {
              return `Bias adjusted Model RH: ${weatherValue} (%)`
            }
          }
          return ''
        }
      })
    }
  }, [
    classes.root,
    _readingValues,
    _modelValues,
    _modelSummaries,
    _forecastValues,
    _pastForecastValues,
    _forecastSummaries,
    _recentHistoricModelValues,
    _biasAdjustedModelValues
  ])

  return (
    <div className={classes.root}>
      <svg data-testid="temp-rh-graph" ref={svgRef} />
    </div>
  )
}

export default React.memo(TempRHGraph)
