import { ModelsResponse, HistoricModelSummariesResponse } from 'api/modelAPI'
import { ReadingsResponse } from 'api/readingAPI'

export const mockStations = [
  { code: 1, name: 'Station 1', lat: 1, long: 1 },
  { code: 2, name: 'Station 2', lat: 2, long: 2 }
]

export const emptyModelsResponse = {
  forecasts: []
}

export const mockModelsResponse: RecursivePartial<ModelsResponse> = {
  forecasts: [
    {
      station: mockStations[0],
      values: [
        {
          datetime: '2020-04-30T12:00:00',
          temperature: 7.4,
          relative_humidity: 69,
          wind_direction: 230,
          wind_speed: 5,
          total_precipitation: 0
        },
        {
          datetime: '2020-04-30T15:00:00',
          temperature: 17.4,
          relative_humidity: 80,
          wind_direction: 234,
          wind_speed: 8,
          total_precipitation: 0
        }
      ]
    }
  ]
}

export const emptyReadingsResponse = {
  hourlies: []
}

export const mockReadingsResponse: RecursivePartial<ReadingsResponse> = {
  hourlies: [
    {
      station: mockStations[0],
      values: [
        {
          datetime: '2020-05-15T11:00:00',
          temperature: 16.9,
          relative_humidity: 37.0,
          wind_speed: 9.0,
          wind_direction: 45.0,
          barometric_pressure: 0.0,
          precipitation: 0.0,
          ffmc: undefined,
          isi: undefined,
          fwi: undefined
        },
        {
          datetime: '2020-05-15T12:00:00',
          temperature: 19.9,
          relative_humidity: 45.0,
          wind_speed: 9.0,
          wind_direction: 45.0,
          barometric_pressure: 0.0,
          precipitation: 0.0,
          ffmc: undefined,
          isi: undefined,
          fwi: undefined
        }
      ]
    }
  ]
}

export const emptyHistoricModelsResponse = {
  summaries: []
}

export const mockHistoricModelsResponse: RecursivePartial<HistoricModelSummariesResponse> = {
  summaries: [
    {
      station: mockStations[0],
      model: { name: 'Global Deterministic Prediction System', abbrev: 'GDPS' },
      values: [
        {
          datetime: '2020-08-01T00:00:00+00:00',
          tmp_tgl_2_5th: 20.0,
          tmp_tgl_2_90th: 24.0,
          tmp_tgl_2_median: 23.0,
          rh_tgl_2_5th: 52.0,
          rh_tgl_2_90th: 73.0,
          rh_tgl_2_median: 61.0
        },
        {
          datetime: '2020-08-01T03:00:00+00:00',
          tmp_tgl_2_5th: 20.3,
          tmp_tgl_2_90th: 23.3,
          tmp_tgl_2_median: 22.3,
          rh_tgl_2_5th: 64.3,
          rh_tgl_2_90th: 81.3,
          rh_tgl_2_median: 72.4
        }
      ]
    }
  ]
}
