import axios from 'api/axios'
import { Station } from 'api/stationAPI'

export interface ModelValue {
  datetime: string
  temperature: number
  relative_humidity: number
  wind_direction: number
  wind_speed: number
  total_precipitation: number
  dew_point: number
  accumulated_rain: number
  accumulated_snow: number
  accumulated_freezing_rain: number
  accumulated_ice_pellets: number
  cloud_cover: number
  sea_level_pressure: number
  wind_speed_40m: number
  wind_direction_40m: number
  wind_direction_80m: number
  wind_speed_120m: number
  wind_direction_120m: number
  wind_speed_925mb: number
  wind_direction_925mb: number
  wind_speed_850mb: number
  wind_direction_850m: number
}

export interface Model {
  station: Station
  values: ModelValue[]
}

export interface ModelsResponse {
  forecasts: Model[]
}

export async function getModels(stationCodes: number[]): Promise<Model[]> {
  const url = '/models/GDPS/forecasts/'

  try {
    const { data } = await axios.post<ModelsResponse>(url, {
      stations: stationCodes
    })
    return data.forecasts
  } catch (err) {
    throw err.toString()
  }
}

export interface HistoricModel {
  datetime: string
  tmp_tgl_2_5th: number
  tmp_tgl_2_median: number
  tmp_tgl_2_90th: number
  rh_tgl_2_5th: number
  rh_tgl_2_median: number
  rh_tgl_2_90th: number
}

interface ModelInfo {
  name: string
  abbrev: string
}

export interface HistoricModelSummary {
  station: Station
  model: ModelInfo | null
  values: HistoricModel[]
}

export interface HistoricModelSummariesResponse {
  summaries: HistoricModelSummary[]
}

export async function getHistoricModels(
  stationCodes: number[],
  model: 'GDPS'
): Promise<HistoricModelSummary[]> {
  const url = `/models/${model}/forecasts/summaries/`
  try {
    const { data } = await axios.post<HistoricModelSummariesResponse>(url, {
      stations: stationCodes
    })

    return data.summaries
  } catch (err) {
    throw err.toString()
  }
}
