import moment from 'moment'
import { isNoonInPST } from './date'

const getFutureValues = () => {
  const _modelValues = []
  const _highResModelValues = []
  const _forecastValues = []

  const days = 2
  const first = moment()
    .utc()
    .set({ minute: 0, second: 0 })
  const last = moment(first).add(days, 'days')

  while (last.diff(first, 'days') >= 0) {
    for (let length = 0; length < 24; length++) {
      const temp = 15 + Math.random() * 10
      const rh = 40 + Math.random() * 15
      const dew_point = Math.random() * 10
      const wind_speed = Math.random() * 10
      const wind_direction = Math.random() * 100
      const total_precipitation = Math.random()
      const datetime = moment(first)
        .add(length, 'hours')
        .utc()
        .format()

      if (length % 3 === 0 || isNoonInPST(datetime)) {
        _modelValues.push({
          datetime,
          temperature: temp + Math.random() * 4,
          bias_adjusted_temperature: temp + Math.random() * 4 - 2,
          dew_point,
          relative_humidity: rh + Math.random() * 4,
          bias_adjusted_relative_humidity: rh + Math.random() * 4 - 5,
          wind_speed,
          wind_direction,
          total_precipitation
        })
      }

      if (isNoonInPST(datetime)) {
        _forecastValues.push({
          datetime,
          temperature: Math.random() * 30,
          relative_humidity: Math.random() * 101
        })
      }

      _highResModelValues.push({
        datetime,
        temperature: temp + Math.random(),
        bias_adjusted_temperature: temp + Math.random() - 2,
        relative_humidity: rh + Math.random(),
        bias_adjusted_relative_humidity: rh + Math.random() - 2
      })
    }
    first.add(1, 'days')
  }

  return {
    modelValues: _modelValues,
    highResModelValues: _highResModelValues,
    forecastValues: _forecastValues
  }
}

const getPastValues = () => {
  const _readingValues = []
  const _pastForecastValues = []
  const _forecastSummaries = []
  const _pastModelValues = []
  const _modelSummaries = []
  const _pastHighResModelValues = []
  const _highResModelSummaries = []

  const days = 2
  const first = moment()
    .utc()
    .set({ minute: 0, second: 0 })
    .subtract(days, 'days')
  const last = moment(first).add(days - 1, 'days')

  while (last.diff(first, 'days') >= 0) {
    for (let length = 0; length < 24; length++) {
      const temp = 15 + Math.random() * 10
      const rh = 40 + Math.random() * 15
      const datetime = moment(first)
        .add(length, 'hours')
        .utc()
        .format()

      // every hour
      _readingValues.push({
        datetime,
        temperature: Math.random() <= 0.8 ? temp : null,
        relative_humidity: rh,
        wind_speed: Math.random() * 10,
        wind_direction: Math.random() * 100,
        barometric_pressure: Math.random() * 10,
        precipitation: Math.random() * 10,
        ffmc: null,
        isi: null,
        fwi: null
      })
      _pastHighResModelValues.push({
        datetime,
        temperature: temp + Math.random(),
        bias_adjusted_temperature: temp + Math.random() - 2,
        relative_humidity: rh + Math.random(),
        bias_adjusted_relative_humidity: rh + Math.random() - 2
      })
      _highResModelSummaries.push({
        datetime,
        tmp_tgl_2_5th: temp + Math.random() * 3,
        tmp_tgl_2_median: temp + Math.random() * 1,
        tmp_tgl_2_90th: temp - Math.random() * 3,
        rh_tgl_2_5th: rh + Math.random() * 3,
        rh_tgl_2_median: rh + Math.random() * 1,
        rh_tgl_2_90th: rh - Math.random() * 3
      })

      if (isNoonInPST(datetime)) {
        _pastForecastValues.push({
          datetime,
          temperature: temp + Math.random() * 2,
          relative_humidity: rh + Math.random() * 2
        })
        _forecastSummaries.push({
          datetime,
          tmp_min: temp + Math.random() * 1,
          tmp_max: temp + Math.random() * 5,
          rh_min: rh + Math.random() * 1,
          rh_max: rh + Math.random() * 5
        })
      }

      // every 3 hour
      if (length % 3 === 0) {
        _pastModelValues.push({
          datetime,
          temperature: temp + Math.random() * 3,
          bias_adjusted_temperature: temp + Math.random() * 3 - 2,
          relative_humidity: rh + Math.random() * 3,
          bias_adjusted_relative_humidity: rh + Math.random() * 3 - 2
        })
        _modelSummaries.push({
          datetime,
          tmp_tgl_2_5th: temp + Math.random() * 5,
          tmp_tgl_2_median: temp + Math.random() * 2,
          tmp_tgl_2_90th: temp - Math.random() * 5,
          rh_tgl_2_5th: rh + Math.random() * 5,
          rh_tgl_2_median: rh + Math.random() * 2,
          rh_tgl_2_90th: rh - Math.random() * 5
        })
      }
    }

    first.add(1, 'days')
  }

  return {
    readingValues: _readingValues,
    pastForecastValues: _pastForecastValues,
    forecastSummaries: _forecastSummaries,
    pastModelValues: _pastModelValues,
    modelSummaries: _modelSummaries,
    pastHighResModelValues: _pastHighResModelValues,
    highResModelSummaries: _highResModelSummaries
  }
}

export const { forecastValues, modelValues, highResModelValues } = getFutureValues()

export const {
  readingValues,
  pastForecastValues,
  forecastSummaries,
  pastModelValues,
  modelSummaries,
  pastHighResModelValues,
  highResModelSummaries
} = getPastValues()
