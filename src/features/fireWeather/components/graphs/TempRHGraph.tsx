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
  biasAdjustedModelTemp?: number
  biasAdjustedModelRH?: number
  hrModelTemp?: number
  hrModelRH?: number
}
type ModelSummary = Omit<_ModelSummary, 'datetime'> & { date: Date }
type ForecastSummary = Omit<_ForecastSummary, 'datetime'> & { date: Date }

interface Props {
  readingValues: ReadingValue[]
  modelValues: ModelValue[]
  modelSummaries: _ModelSummary[]
  forecastValues: NoonForecastValue[]
  forecastSummaries: _ForecastSummary[]
  biasAdjustedModelValues: ModelValue[]
  highResModelValues: ModelValue[]
  highResModelSummaries: _ModelSummary[]
}

const TempRHGraph: React.FunctionComponent<Props> = ({
  readingValues: _readingValues,
  modelValues: _modelValues,
  modelSummaries: _modelSummaries,
  forecastValues: _forecastValues,
  forecastSummaries: _forecastSummaries,
  biasAdjustedModelValues: _biasAdjustedModelValues,
  highResModelValues: _highResModelValues,
  highResModelSummaries: _highResModelSummaries
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

      const readingTempValues: { date: Date; temp: number }[] = []
      const readingRHValues: { date: Date; rh: number }[] = []
      _readingValues.forEach(v => {
        if (v.temperature == null && v.relative_humidity == null) {
          return
        }

        const date = d3Utils.storeDaysLookup(daysLookup, v.datetime)
        allDates.push(date)

        const reading = { date, temp: NaN, rh: NaN }
        if (v.temperature != null) {
          reading.temp = Number(v.temperature.toFixed(2))
          readingTempValues.push(reading)
        }
        if (v.relative_humidity != null) {
          reading.rh = Math.round(v.relative_humidity)
          readingRHValues.push(reading)
        }
        weatherValueByDatetime[v.datetime] = reading
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

      const forecastSummaries: ForecastSummary[] = _forecastSummaries.map(d => {
        const date = d3Utils.storeDaysLookup(daysLookup, d.datetime)
        allDates.push(date)

        return { ...d, date }
      })

      const modelTempValues: { date: Date; modelTemp: number }[] = []
      const modelRHValues: { date: Date; modelRH: number }[] = []
      _modelValues.forEach(v => {
        const { temperature: temp, relative_humidity: rh } = v

        if (temp == null && rh == null) {
          return
        }

        const date = d3Utils.storeDaysLookup(daysLookup, v.datetime)
        allDates.push(date)

        const model = {
          date,
          modelTemp: NaN,
          modelRH: NaN
        }
        if (temp != null) {
          model.modelTemp = Number(temp.toFixed(2))
          modelTempValues.push(model)
        }
        if (rh != null) {
          model.modelRH = Math.round(rh)
          modelRHValues.push(model)
        }
        // combine with the existing reading value
        weatherValueByDatetime[v.datetime] = {
          ...weatherValueByDatetime[v.datetime],
          ...model
        }
      })

      const modelSummaries: ModelSummary[] = _modelSummaries.map(d => {
        const date = d3Utils.storeDaysLookup(daysLookup, d.datetime)
        allDates.push(date)

        return { ...d, date }
      })

      const biasAdjModelTempValues: { date: Date; biasAdjustedModelTemp: number }[] = []
      const biasAdjModelRHValues: { date: Date; biasAdjustedModelRH: number }[] = []
      _biasAdjustedModelValues.forEach(v => {
        const {
          bias_adjusted_temperature: biasAdjTemp,
          bias_adjusted_relative_humidity: biasAdjRH
        } = v
        if (biasAdjTemp == null && biasAdjRH == null) {
          return
        }

        const date = d3Utils.storeDaysLookup(daysLookup, v.datetime)
        allDates.push(date)

        const biasAdjustedModel = {
          date,
          biasAdjustedModelTemp: NaN,
          biasAdjustedModelRH: NaN
        }
        if (biasAdjTemp != null) {
          biasAdjustedModel.biasAdjustedModelTemp = Number(biasAdjTemp.toFixed(2))
          biasAdjModelTempValues.push(biasAdjustedModel)
        }
        if (biasAdjRH != null) {
          biasAdjustedModel.biasAdjustedModelRH = Math.round(biasAdjRH)
          biasAdjModelRHValues.push(biasAdjustedModel)
        }
        weatherValueByDatetime[v.datetime] = {
          ...weatherValueByDatetime[v.datetime],
          ...biasAdjustedModel
        }
      })

      const hrModelTempValues: { date: Date; hrModelTemp: number }[] = []
      const hrModelRHValues: { date: Date; hrModelRH: number }[] = []
      _highResModelValues.forEach(v => {
        if (v.temperature == null && v.relative_humidity == null) {
          return
        }

        const date = d3Utils.storeDaysLookup(daysLookup, v.datetime)
        allDates.push(date)

        const hrModel = { date, hrModelTemp: NaN, hrModelRH: NaN }
        if (v.temperature != null) {
          hrModel.hrModelTemp = Number(v.temperature.toFixed(2))
          hrModelTempValues.push(hrModel)
        }
        if (v.relative_humidity != null) {
          hrModel.hrModelRH = Math.round(v.relative_humidity)
          hrModelRHValues.push(hrModel)
        }
        weatherValueByDatetime[v.datetime] = {
          ...weatherValueByDatetime[v.datetime],
          ...hrModel
        }
      })
      const highResModelSummaries: ModelSummary[] = _highResModelSummaries.map(d => {
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

      /* Render high resolution model temp and rh summary clouds */
      d3Utils.drawArea({
        svg,
        className: 'highResModelSummaryTempArea',
        datum: highResModelSummaries,
        x: d => xScale(d.date),
        y0: d => yTempScale(d.tmp_tgl_2_90th),
        y1: d => yTempScale(d.tmp_tgl_2_5th),
        testId: 'high-res-model-summary-temp-area'
      })
      d3Utils.drawArea({
        svg,
        className: 'highResModelSummaryRHArea',
        datum: highResModelSummaries,
        x: d => xScale(d.date),
        y0: d => yRHScale(d.rh_tgl_2_90th),
        y1: d => yRHScale(d.rh_tgl_2_5th)
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

      /* Render temp and rh models */
      d3Utils.drawDots({
        svg,
        className: 'modelTempDot',
        data: modelTempValues,
        cx: d => xScale(d.date),
        cy: d => yTempScale(d.modelTemp),
        testId: 'model-temp-dot'
      })
      d3Utils.drawPath({
        svg,
        className: 'modelTempPath',
        data: modelTempValues,
        x: d => xScale(d.date),
        y: d => yTempScale(d.modelTemp),
        testId: 'model-temp-path'
      })
      d3Utils.drawDots({
        svg,
        className: 'modelRHDot',
        data: modelRHValues,
        cx: d => xScale(d.date),
        cy: d => yRHScale(d.modelRH)
      })
      d3Utils.drawPath({
        svg,
        className: 'modelRHPath',
        data: modelRHValues,
        x: d => xScale(d.date),
        y: d => yRHScale(d.modelRH),
        testId: 'model-rh-path'
      })

      /* Render bias adjusted model temp and rh values */
      d3Utils.drawDots({
        svg,
        className: 'biasAdjustedModelTempDot',
        data: biasAdjModelTempValues,
        cx: d => xScale(d.date),
        cy: d => yTempScale(d.biasAdjustedModelTemp),
        radius: 0.5,
        testId: 'bias-adjusted-model-temp-dot'
      })
      d3Utils.drawPath({
        svg,
        className: 'biasAdjustedModelTempPath',
        data: biasAdjModelTempValues,
        x: d => xScale(d.date),
        y: d => yTempScale(d.biasAdjustedModelTemp),
        testId: 'bias-adjusted-model-temp-path'
      })
      d3Utils.drawDots({
        svg,
        className: 'biasAdjustedModelRHDot',
        data: biasAdjModelRHValues,
        cx: d => xScale(d.date),
        cy: d => yRHScale(d.biasAdjustedModelRH),
        radius: 0.5,
        testId: 'bias-adjusted-model-rh-dot'
      })
      d3Utils.drawPath({
        svg,
        className: 'biasAdjustedModelRHPath',
        data: biasAdjModelRHValues,
        x: d => xScale(d.date),
        y: d => yRHScale(d.biasAdjustedModelRH),
        testId: 'bias-adjusted-model-rh-path'
      })

      /* Render high resolution model temp and rh values */
      d3Utils.drawDots({
        svg,
        className: 'highResModelTempDot',
        data: hrModelTempValues,
        cx: d => xScale(d.date),
        cy: d => yTempScale(d.hrModelTemp),
        testId: 'high-res-model-temp-dot'
      })
      d3Utils.drawPath({
        svg,
        className: 'highResModelTempPath',
        data: hrModelTempValues,
        x: d => xScale(d.date),
        y: d => yTempScale(d.hrModelTemp),
        testId: 'high-res-model-temp-path'
      })
      d3Utils.drawDots({
        svg,
        className: 'highResModelRHDot',
        data: hrModelRHValues,
        cx: d => xScale(d.date),
        cy: d => yRHScale(d.hrModelRH)
      })
      d3Utils.drawPath({
        svg,
        className: 'highResModelRHPath',
        data: hrModelRHValues,
        x: d => xScale(d.date),
        y: d => yRHScale(d.hrModelRH),
        testId: 'high-res-model-rh-path'
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

      /* Render temp and rh hourly readings */
      d3Utils.drawDots({
        svg,
        className: 'readingTempDot',
        data: readingTempValues,
        cx: d => xScale(d.date),
        cy: d => yTempScale(d.temp),
        testId: 'hourly-reading-temp-dot'
      })
      d3Utils.drawPath({
        svg,
        className: 'readingTempPath',
        data: readingTempValues,
        x: d => xScale(d.date),
        y: d => yTempScale(d.temp),
        strokeWidth: 1.5,
        testId: 'hourly-reading-temp-path'
      })
      d3Utils.drawDots({
        svg,
        className: 'readingRHDot',
        data: readingRHValues,
        cx: d => xScale(d.date),
        cy: d => yRHScale(d.rh),
        testId: 'hourly-reading-rh-dot'
      })
      d3Utils.drawPath({
        svg,
        className: 'readingRHPath',
        data: readingRHValues,
        x: d => xScale(d.date),
        y: d => yRHScale(d.rh),
        strokeWidth: 1.5,
        testId: 'hourly-reading-rh-path'
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
      // TODO: We're going to have to look at using layouts moving forward to achieve the placement of objects. https://www.d3indepth.com/layouts/
      let legendY = height + margin.bottom - 45
      let legendX = 0
      d3Utils.addLegend({
        svg,
        text: 'Observed Temp',
        color: styles.readingTempDotColor,
        shapeX: legendX,
        shapeY: legendY,
        textX: legendX += 7,
        textY: legendY + 3
      })
      d3Utils.addLegend({
        svg,
        text: 'Observed RH',
        color: styles.readingRHDotColor,
        shapeX: legendX += 83,
        shapeY: legendY,
        textX: legendX += 7,
        textY: legendY + 3
      })
      d3Utils.addLegend({
        svg,
        text: 'Forecast Temp',
        color: styles.forecastTempDotColor,
        fill: 'none',
        shapeX: legendX += 73,
        shapeY: legendY,
        textX: legendX += 7,
        textY: legendY + 3
      })
      d3Utils.addLegend({
        svg,
        text: 'Forecast RH',
        color: styles.forecastRHDotColor,
        fill: 'none',
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
        shapeX: legendX += 70,
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
        shapeX: legendX += 165,
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
      d3Utils.addLegend({
        svg,
        text: 'High Res Model Temp',
        color: styles.highResModelTempDotColor,
        fill: 'none',
        shapeX: legendX += 127,
        shapeY: legendY,
        textX: legendX += 7,
        textY: legendY + 3
      })
      d3Utils.addLegend({
        svg,
        text: 'High Res Model RH',
        color: styles.highResModelRHDotColor,
        fill: 'none',
        shapeX: legendX += 111,
        shapeY: legendY,
        textX: legendX + 7,
        textY: legendY + 3
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
        getInnerText: ([k, value]) => {
          const key = k as keyof WeatherValue
          if (key === 'date' && typeof value === 'object') {
            return `${formatDateInPDT(value, 'h:mm a, ddd, MMM Do')} (PDT, UTC-7)`
          } else if (typeof value === 'number') {
            let weatherValue: number | string = value
            if (isNaN(weatherValue)) {
              weatherValue = '-'
            }

            switch (key) {
              case 'temp':
                return `Observed Temp: ${weatherValue} (°C)`
              case 'forecastTemp':
                return `Forecast Temp: ${weatherValue} (°C)`
              case 'modelTemp':
                return `Model Temp: ${weatherValue} (°C)`
              case 'biasAdjustedModelTemp':
                return `Bias adjusted Temp: ${weatherValue} (°C)`
              case 'hrModelTemp':
                return `High Res Model Temp ${weatherValue} (°C)`

              case 'rh':
                return `Observed RH: ${weatherValue} (%)`
              case 'forecastRH':
                return `Forecast RH: ${weatherValue} (%)`
              case 'modelRH':
                return `Model RH: ${weatherValue} (%)`
              case 'biasAdjustedModelRH':
                return `Bias adjusted Model RH: ${weatherValue} (%)`
              case 'hrModelRH':
                return `High Res Model RH ${weatherValue} (%)`

              default:
                return ''
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
    _forecastSummaries,
    _highResModelValues,
    _biasAdjustedModelValues,
    _highResModelSummaries
  ])

  return (
    <div className={classes.root}>
      <svg data-testid="temp-rh-graph" ref={svgRef} />
    </div>
  )
}

export default React.memo(TempRHGraph)
