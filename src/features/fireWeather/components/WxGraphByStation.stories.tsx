import React from 'react'
import { storiesOf } from '@storybook/react'

import WxGraphByStation from 'features/fireWeather/components/WxGraphByStation'

storiesOf('WxGraphByStation', module).add('default', () => {
  return <WxGraphByStation values={values} /> // eslint-disable-line @typescript-eslint/no-use-before-define
})

const values = [
  {
    datetime: '2020-05-27T00:00:00+00:00',
    temperature: -0.5,
    dew_point: -5.1,
    relative_humidity: 32,
    wind_speed: 16,
    wind_direction: 292,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 0,
    sea_level_pressure: 1018.2,
    wind_speed_40m: 23,
    wind_direction_40m: 294,
    wind_direction_80m: 294,
    wind_speed_120m: 28,
    wind_direction_120m: 294,
    wind_speed_925mb: 21,
    wind_direction_925mb: 295,
    wind_speed_850mb: 35,
    wind_direction_850m: 294
  },
  {
    datetime: '2020-05-27T03:00:00+00:00',
    temperature: 9.9,
    dew_point: -4.4,
    relative_humidity: 36,
    wind_speed: 12,
    wind_direction: 281,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 0,
    sea_level_pressure: 1019.4,
    wind_speed_40m: 20,
    wind_direction_40m: 288,
    wind_direction_80m: 288,
    wind_speed_120m: 26,
    wind_direction_120m: 288,
    wind_speed_925mb: 18,
    wind_direction_925mb: 287,
    wind_speed_850mb: 33,
    wind_direction_850m: 289
  },
  {
    datetime: '2020-05-27T06:00:00+00:00',
    temperature: 7.1,
    dew_point: -4.3,
    relative_humidity: 44,
    wind_speed: 8,
    wind_direction: 270,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 0,
    sea_level_pressure: 1021.9,
    wind_speed_40m: 17,
    wind_direction_40m: 280,
    wind_direction_80m: 281,
    wind_speed_120m: 25,
    wind_direction_120m: 282,
    wind_speed_925mb: 16,
    wind_direction_925mb: 279,
    wind_speed_850mb: 34,
    wind_direction_850m: 288
  },
  {
    datetime: '2020-05-27T09:00:00+00:00',
    temperature: 5.6,
    dew_point: -3.3,
    relative_humidity: 53,
    wind_speed: 7,
    wind_direction: 267,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 0,
    sea_level_pressure: 1023.3,
    wind_speed_40m: 15,
    wind_direction_40m: 279,
    wind_direction_80m: 281,
    wind_speed_120m: 22,
    wind_direction_120m: 282,
    wind_speed_925mb: 15,
    wind_direction_925mb: 278,
    wind_speed_850mb: 32,
    wind_direction_850m: 300
  },
  {
    datetime: '2020-05-27T12:00:00+00:00',
    temperature: 3.9,
    dew_point: -3.6,
    relative_humidity: 58,
    wind_speed: 6,
    wind_direction: 262,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 0,
    sea_level_pressure: 1024.2,
    wind_speed_40m: 13,
    wind_direction_40m: 274,
    wind_direction_80m: 280,
    wind_speed_120m: 19,
    wind_direction_120m: 282,
    wind_speed_925mb: 13,
    wind_direction_925mb: 276,
    wind_speed_850mb: 23,
    wind_direction_850m: 314
  },
  {
    datetime: '2020-05-27T15:00:00+00:00',
    temperature: 6.4,
    dew_point: -2.5,
    relative_humidity: 53,
    wind_speed: 5,
    wind_direction: 269,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 0,
    sea_level_pressure: 1024.2,
    wind_speed_40m: 8,
    wind_direction_40m: 280,
    wind_direction_80m: 281,
    wind_speed_120m: 11,
    wind_direction_120m: 282,
    wind_speed_925mb: 8,
    wind_direction_925mb: 280,
    wind_speed_850mb: 14,
    wind_direction_850m: 314
  },
  {
    datetime: '2020-05-27T18:00:00+00:00',
    temperature: 9.2,
    dew_point: -2.4,
    relative_humidity: 44,
    wind_speed: 3,
    wind_direction: 259,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 0,
    sea_level_pressure: 1022.7,
    wind_speed_40m: 6,
    wind_direction_40m: 261,
    wind_direction_80m: 263,
    wind_speed_120m: 7,
    wind_direction_120m: 261,
    wind_speed_925mb: 6,
    wind_direction_925mb: 264,
    wind_speed_850mb: 8,
    wind_direction_850m: 260
  },
  {
    datetime: '2020-05-27T20:00:00+00:00',
    temperature: 10.666666666666666,
    dew_point: -3.333333333333333,
    relative_humidity: 37.333333333333336,
    wind_speed: 1.6666666666666667,
    wind_direction: 277,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 0,
    sea_level_pressure: 1021.9,
    wind_speed_40m: 2.666666666666667,
    wind_direction_40m: 256.3333333333333,
    wind_direction_80m: 267.6666666666667,
    wind_speed_120m: 3,
    wind_direction_120m: 254.33333333333334,
    wind_speed_925mb: 2.666666666666667,
    wind_direction_925mb: 276.6666666666667,
    wind_speed_850mb: 3.333333333333333,
    wind_direction_850m: 232.66666666666666
  },
  {
    datetime: '2020-05-27T21:00:00+00:00',
    temperature: 11.4,
    dew_point: -3.8,
    relative_humidity: 34,
    wind_speed: 1,
    wind_direction: 286,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 0,
    sea_level_pressure: 1021.5,
    wind_speed_40m: 1,
    wind_direction_40m: 254,
    wind_direction_80m: 270,
    wind_speed_120m: 1,
    wind_direction_120m: 251,
    wind_speed_925mb: 1,
    wind_direction_925mb: 283,
    wind_speed_850mb: 1,
    wind_direction_850m: 219
  },
  {
    datetime: '2020-05-28T00:00:00+00:00',
    temperature: 12.4,
    dew_point: -4.8,
    relative_humidity: 30,
    wind_speed: 1,
    wind_direction: 165,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 8,
    sea_level_pressure: 1020.9,
    wind_speed_40m: 3,
    wind_direction_40m: 166,
    wind_direction_80m: 167,
    wind_speed_120m: 4,
    wind_direction_120m: 164,
    wind_speed_925mb: 3,
    wind_direction_925mb: 167,
    wind_speed_850mb: 6,
    wind_direction_850m: 162
  },
  {
    datetime: '2020-05-28T03:00:00+00:00',
    temperature: 11.5,
    dew_point: -2.9,
    relative_humidity: 36,
    wind_speed: 1,
    wind_direction: 122,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 32,
    sea_level_pressure: 1020.9,
    wind_speed_40m: 2,
    wind_direction_40m: 133,
    wind_direction_80m: 141,
    wind_speed_120m: 3,
    wind_direction_120m: 138,
    wind_speed_925mb: 2,
    wind_direction_925mb: 143,
    wind_speed_850mb: 8,
    wind_direction_850m: 146
  },
  {
    datetime: '2020-05-28T06:00:00+00:00',
    temperature: 8.2,
    dew_point: -2.9,
    relative_humidity: 45,
    wind_speed: 6,
    wind_direction: 73,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 68,
    sea_level_pressure: 1021.8,
    wind_speed_40m: 14,
    wind_direction_40m: 89,
    wind_direction_80m: 94,
    wind_speed_120m: 22,
    wind_direction_120m: 97,
    wind_speed_925mb: 15,
    wind_direction_925mb: 92,
    wind_speed_850mb: 19,
    wind_direction_850m: 111
  },
  {
    datetime: '2020-05-28T09:00:00+00:00',
    temperature: 7.8,
    dew_point: -2.8,
    relative_humidity: 47,
    wind_speed: 5,
    wind_direction: 82,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 76,
    sea_level_pressure: 1022.8,
    wind_speed_40m: 12,
    wind_direction_40m: 93,
    wind_direction_80m: 95,
    wind_speed_120m: 19,
    wind_direction_120m: 101,
    wind_speed_925mb: 13,
    wind_direction_925mb: 94,
    wind_speed_850mb: 19,
    wind_direction_850m: 146
  },
  {
    datetime: '2020-05-28T12:00:00+00:00',
    temperature: 6.7,
    dew_point: -3.3,
    relative_humidity: 49,
    wind_speed: 5,
    wind_direction: 61,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 64,
    sea_level_pressure: 1022.8,
    wind_speed_40m: 10,
    wind_direction_40m: 76,
    wind_direction_80m: 81,
    wind_speed_120m: 17,
    wind_direction_120m: 87,
    wind_speed_925mb: 11,
    wind_direction_925mb: 78,
    wind_speed_850mb: 20,
    wind_direction_850m: 124
  },
  {
    datetime: '2020-05-28T15:00:00+00:00',
    temperature: 9,
    dew_point: -2.5,
    relative_humidity: 44,
    wind_speed: 6,
    wind_direction: 70,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 20,
    sea_level_pressure: 1021.2,
    wind_speed_40m: 11,
    wind_direction_40m: 79,
    wind_direction_80m: 80,
    wind_speed_120m: 16,
    wind_direction_120m: 81,
    wind_speed_925mb: 11,
    wind_direction_925mb: 79,
    wind_speed_850mb: 21,
    wind_direction_850m: 108
  },
  {
    datetime: '2020-05-28T18:00:00+00:00',
    temperature: 13,
    dew_point: -3.1,
    relative_humidity: 32,
    wind_speed: 8,
    wind_direction: 78,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 32,
    sea_level_pressure: 1018.5,
    wind_speed_40m: 14,
    wind_direction_40m: 84,
    wind_direction_80m: 84,
    wind_speed_120m: 17,
    wind_direction_120m: 84,
    wind_speed_925mb: 12,
    wind_direction_925mb: 84,
    wind_speed_850mb: 26,
    wind_direction_850m: 98
  },
  {
    datetime: '2020-05-28T20:00:00+00:00',
    temperature: 14.466666666666667,
    dew_point: -3.033333333333333,
    relative_humidity: 29.333333333333332,
    wind_speed: 8.666666666666666,
    wind_direction: 86,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 61.333333333333336,
    sea_level_pressure: 1017.0333333333333,
    wind_speed_40m: 14.666666666666666,
    wind_direction_40m: 90,
    wind_direction_80m: 90,
    wind_speed_120m: 18.333333333333332,
    wind_direction_120m: 90,
    wind_speed_925mb: 12.666666666666666,
    wind_direction_925mb: 90,
    wind_speed_850mb: 24.666666666666668,
    wind_direction_850m: 94.66666666666667
  },
  {
    datetime: '2020-05-28T21:00:00+00:00',
    temperature: 15.2,
    dew_point: -3,
    relative_humidity: 28,
    wind_speed: 9,
    wind_direction: 90,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 76,
    sea_level_pressure: 1016.3,
    wind_speed_40m: 15,
    wind_direction_40m: 93,
    wind_direction_80m: 93,
    wind_speed_120m: 19,
    wind_direction_120m: 93,
    wind_speed_925mb: 13,
    wind_direction_925mb: 93,
    wind_speed_850mb: 24,
    wind_direction_850m: 93
  },
  {
    datetime: '2020-05-29T00:00:00+00:00',
    temperature: 14.7,
    dew_point: -2,
    relative_humidity: 32,
    wind_speed: 9,
    wind_direction: 110,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 92,
    sea_level_pressure: 1016,
    wind_speed_40m: 15,
    wind_direction_40m: 117,
    wind_direction_80m: 115,
    wind_speed_120m: 19,
    wind_direction_120m: 118,
    wind_speed_925mb: 11,
    wind_direction_925mb: 112,
    wind_speed_850mb: 23,
    wind_direction_850m: 124
  },
  {
    datetime: '2020-05-29T03:00:00+00:00',
    temperature: 12.9,
    dew_point: 1.2,
    relative_humidity: 45,
    wind_speed: 13,
    wind_direction: 177,
    total_precipitation: 0,
    accumulated_rain: 0,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 88,
    sea_level_pressure: 1017.7,
    wind_speed_40m: 18,
    wind_direction_40m: 178,
    wind_direction_80m: 178,
    wind_speed_120m: 23,
    wind_direction_120m: 176,
    wind_speed_925mb: 16,
    wind_direction_925mb: 179,
    wind_speed_850mb: 25,
    wind_direction_850m: 164
  },
  {
    datetime: '2020-05-29T06:00:00+00:00',
    temperature: 8.6,
    dew_point: 4.5,
    relative_humidity: 75,
    wind_speed: 2,
    wind_direction: 225,
    total_precipitation: 0.02,
    accumulated_rain: 0.02,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 64,
    sea_level_pressure: 1018.8,
    wind_speed_40m: 5,
    wind_direction_40m: 216,
    wind_direction_80m: 216,
    wind_speed_120m: 8,
    wind_direction_120m: 195,
    wind_speed_925mb: 5,
    wind_direction_925mb: 229,
    wind_speed_850mb: 22,
    wind_direction_850m: 119
  },
  {
    datetime: '2020-05-29T09:00:00+00:00',
    temperature: 6.7,
    dew_point: 5,
    relative_humidity: 89,
    wind_speed: 2,
    wind_direction: 233,
    total_precipitation: 0.02,
    accumulated_rain: 0.02,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 56,
    sea_level_pressure: 1019.1,
    wind_speed_40m: 4,
    wind_direction_40m: 222,
    wind_direction_80m: 207,
    wind_speed_120m: 9,
    wind_direction_120m: 187,
    wind_speed_925mb: 3,
    wind_direction_925mb: 236,
    wind_speed_850mb: 23,
    wind_direction_850m: 137
  },
  {
    datetime: '2020-05-29T12:00:00+00:00',
    temperature: 5.8,
    dew_point: 4.3,
    relative_humidity: 90,
    wind_speed: 2,
    wind_direction: 88,
    total_precipitation: 0.02,
    accumulated_rain: 0.02,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 44,
    sea_level_pressure: 1019.7,
    wind_speed_40m: 5,
    wind_direction_40m: 106,
    wind_direction_80m: 118,
    wind_speed_120m: 7,
    wind_direction_120m: 133,
    wind_speed_925mb: 4,
    wind_direction_925mb: 100,
    wind_speed_850mb: 18,
    wind_direction_850m: 131
  },
  {
    datetime: '2020-05-29T15:00:00+00:00',
    temperature: 8.4,
    dew_point: 3.8,
    relative_humidity: 73,
    wind_speed: 3,
    wind_direction: 95,
    total_precipitation: 0.02,
    accumulated_rain: 0.02,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 12,
    sea_level_pressure: 1019,
    wind_speed_40m: 5,
    wind_direction_40m: 99,
    wind_direction_80m: 97,
    wind_speed_120m: 7,
    wind_direction_120m: 102,
    wind_speed_925mb: 5,
    wind_direction_925mb: 98,
    wind_speed_850mb: 20,
    wind_direction_850m: 118
  },
  {
    datetime: '2020-05-29T18:00:00+00:00',
    temperature: 12.4,
    dew_point: 3.6,
    relative_humidity: 55,
    wind_speed: 6,
    wind_direction: 108,
    total_precipitation: 0.02,
    accumulated_rain: 0.02,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 0,
    sea_level_pressure: 1017.1,
    wind_speed_40m: 11,
    wind_direction_40m: 111,
    wind_direction_80m: 110,
    wind_speed_120m: 13,
    wind_direction_120m: 111,
    wind_speed_925mb: 9,
    wind_direction_925mb: 110,
    wind_speed_850mb: 16,
    wind_direction_850m: 111
  },
  {
    datetime: '2020-05-29T20:00:00+00:00',
    temperature: 14.266666666666666,
    dew_point: 3.6,
    relative_humidity: 49,
    wind_speed: 6.666666666666667,
    wind_direction: 100.66666666666667,
    total_precipitation: 0.02,
    accumulated_rain: 0.02,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 5.333333333333333,
    sea_level_pressure: 1015.7666666666667,
    wind_speed_40m: 11.666666666666666,
    wind_direction_40m: 107,
    wind_direction_80m: 106,
    wind_speed_120m: 14.333333333333334,
    wind_direction_120m: 107,
    wind_speed_925mb: 9,
    wind_direction_925mb: 103.33333333333333,
    wind_speed_850mb: 17.333333333333332,
    wind_direction_850m: 108.33333333333333
  },
  {
    datetime: '2020-05-29T21:00:00+00:00',
    temperature: 15.2,
    dew_point: 3.6,
    relative_humidity: 46,
    wind_speed: 7,
    wind_direction: 97,
    total_precipitation: 0.02,
    accumulated_rain: 0.02,
    accumulated_snow: 0,
    accumulated_freezing_rain: 0,
    accumulated_ice_pellets: 0,
    cloud_cover: 8,
    sea_level_pressure: 1015.1,
    wind_speed_40m: 12,
    wind_direction_40m: 105,
    wind_direction_80m: 104,
    wind_speed_120m: 15,
    wind_direction_120m: 105,
    wind_speed_925mb: 9,
    wind_direction_925mb: 100,
    wind_speed_850mb: 18,
    wind_direction_850m: 107
  }
]
