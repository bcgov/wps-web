// @ts-nocheck
import React from 'react'
import { storiesOf } from '@storybook/react'
import moment from 'moment'

import WxDataGraph from 'features/fireWeather/components/WxDataGraph'

const getModelValues = () => {
  const modelValues = []
  const days = 2
  const first = moment()
    .utc()
    .set({ hour: 0, minute: 0, second: 0 })
  const last = moment(first).add(days, 'days')
  const hourInterval = 3

  while (last.diff(first, 'days') >= 0) {
    for (let length = 0; length < 24 / hourInterval; length++) {
      modelValues.push({
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

  return modelValues
}

const getPastValues = () => {
  const readingValues = []
  const historicModels = []

  const days = 3
  const first = moment()
    .utc()
    .set({ hour: 0, minute: 0, second: 0 })
    .subtract(days, 'days')
  const last = moment(first).add(days, 'days')

  while (last.diff(first, 'days') >= 0) {
    for (let length = 0; length < 24; length++) {
      const temp = 15 + Math.random() * 10
      const rh = 40 + Math.random() * 15

      // every 3 hour
      if (length % 3 === 0) {
        historicModels.push({
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
      readingValues.push({
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

  return { readingValues, historicModels }
}

storiesOf('WxDataGraph', module)
  .add('default', () => {
    const modelValues = getModelValues()
    const { readingValues } = getPastValues()

    return (
      <>
        <WxDataGraph modelValues={modelValues} readingValues={readingValues} />
        <h3>When only model values provided</h3>
        <WxDataGraph modelValues={modelValues} readingValues={[]} />
      </>
    )
  })
  .add('with historic model', () => {
    const modelValues = getModelValues()
    const { readingValues, historicModels } = getPastValues()

    return (
      <WxDataGraph
        modelValues={modelValues}
        readingValues={readingValues}
        historicModels={historicModels}
      />
    )
  })
