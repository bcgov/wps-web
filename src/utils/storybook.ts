import moment from 'moment'

const getModelValues = () => {
  const _modelValues = []
  const days = 2
  const first = moment()
    .utc()
    .set({ hour: 0, minute: 0, second: 0 })
  const last = moment(first).add(days, 'days')
  const hourInterval = 3

  while (last.diff(first, 'days') >= 0) {
    for (let length = 0; length < 24 / hourInterval; length++) {
      _modelValues.push({
        datetime: moment(first)
          .add(hourInterval * length, 'hours')
          .utc()
          .format(),
        temperature: Math.random() * 25,
        dew_point: Math.random() * 10,
        relative_humidity: Math.random() * 101,
        wind_speed: Math.random() * 10,
        wind_direction: Math.random() * 100,
        total_precipitation: Math.random()
      })
    }

    first.add(1, 'days')
  }

  return _modelValues
}

const getPastValues = () => {
  const _readingValues = []
  const _modelSummaries = []
  const _forecastSummaries = []
  const _pastForecastValues = []

  const days = 3
  const first = moment()
    .utc()
    .set({ hour: 0, minute: 0, second: 0 })
    .subtract(days, 'days')
  const last = moment(first).add(days - 1, 'days')

  while (last.diff(first, 'days') >= 0) {
    for (let length = 0; length < 24; length++) {
      const temp = 15 + Math.random() * 10
      const rh = 40 + Math.random() * 15

      // every 12 hour
      if (length % 12 === 0) {
        _pastForecastValues.push({
          datetime: moment(first)
            .add(length, 'hours')
            .utc()
            .format(),
          temperature: temp + Math.random(),
          relative_humidity: rh + Math.random()
        })
        _forecastSummaries.push({
          datetime: moment(first)
            .add(length, 'hours')
            .utc()
            .format(),
          tmp_min: temp + Math.random() * 1,
          tmp_max: temp + Math.random() * 4,
          rh_min: rh + Math.random() * 1,
          rh_max: rh + Math.random() * 4
        })
      }
      // every 3 hour
      if (length % 3 === 0) {
        _modelSummaries.push({
          datetime: moment(first)
            .add(length, 'hours')
            .utc()
            .format(),
          tmp_tgl_2_5th: temp + Math.random() * 5,
          tmp_tgl_2_median: temp + Math.random() * 2,
          tmp_tgl_2_90th: temp - Math.random() * 5,
          rh_tgl_2_5th: rh + Math.random() * 5,
          rh_tgl_2_median: rh + Math.random() * 2,
          rh_tgl_2_90th: rh - Math.random() * 5
        })
      }
      // every hour
      _readingValues.push({
        datetime: moment(first)
          .add(length, 'hours')
          .utc()
          .format(),
        temperature: temp,
        dew_point: Math.random() * 10,
        relative_humidity: rh,
        wind_speed: Math.random() * 10,
        wind_direction: Math.random() * 100,
        total_precipitation: Math.random(),
        ffmc: null,
        isi: null,
        fwi: null
      })
    }

    first.add(1, 'days')
  }

  return {
    readingValues: _readingValues,
    modelSummaries: _modelSummaries,
    pastForecastValues: _pastForecastValues,
    forecastSummaries: _forecastSummaries
  }
}

const getForecastValues = () => {
  const _forecastValues = []
  const days = 4
  const first = moment()
    .utc()
    .set({ hour: 20, minute: 0, second: 0 })
  const last = moment(first).add(days, 'days')

  while (last.diff(first, 'days') >= 0) {
    _forecastValues.push({
      datetime: moment(first)
        .utc()
        .format(),
      temperature: Math.random() * 30,
      relative_humidity: Math.random() * 101
    })

    first.add(1, 'days')
  }
  return _forecastValues
}

export const modelValues = getModelValues()
export const {
  readingValues,
  modelSummaries,
  pastForecastValues,
  forecastSummaries
} = getPastValues()
export const forecastValues = getForecastValues()
