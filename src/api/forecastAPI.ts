import axios from 'api/axios'

export interface NoonForecastValue {
  datetime: string
  temperature: number
  relative_humidity: number
  wind_direction: number
  wind_speed: number
  total_precipitation: number
  gc: number
  ffmc: number
  dmc: number
  dc: number
  isi: number
  bui: number
  fwi: number
  danger_rating: number
  created_at: string
}

export interface Forecast {
  station_code: number
  values: NoonForecastValue[]
}

export interface ForecastResponse {
  noon_forecasts: Forecast[]
}

export async function getNoonForecasts(stationCodes: number[]): Promise<Forecast[]> {
  const url = '/noon_forecasts/'

  try {
    const { data } = await axios.post<ForecastResponse>(url, {
      stations: stationCodes
    })
    return data.noon_forecasts
  } catch (err) {
    throw err.toString()
  }
}
