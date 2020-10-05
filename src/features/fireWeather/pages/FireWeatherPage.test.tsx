import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import { waitForElement, cleanup, fireEvent } from '@testing-library/react'

import { selectStations } from 'app/rootReducer'
import axios from 'api/axios'
import { renderWithRedux } from 'utils/testUtils'
import FireWeatherPage from 'features/fireWeather/pages/FireWeatherPage'
import {
  mockStations,
  mockModelsResponse,
  mockReadingsResponse,
  mockForecastsResponse,
  mockModelSummariesResponse,
  mockForecastSummariesResponse,
  mockRecentHistoricModelsResponse,
  mockRecentModelsResponse,
  emptyModelsResponse,
  emptyReadingsResponse,
  emptyForecastsResponse,
  emptyModelSummariesResponse,
  emptyForecastSummariesResponse,
  emptyRecentHistoricModelsResponse,
  emptyRecentModelsResponse
} from 'features/fireWeather/pages/FireWeatherPage.mock'

const mockAxios = new MockAdapter(axios)

afterEach(() => {
  mockAxios.reset()
  cleanup()
})

it('renders fire weather page', async () => {
  const { getByText, getByTestId } = renderWithRedux(<FireWeatherPage />)
  // before authenticated
  expect(getByText(/Signing in/i)).toBeInTheDocument()

  // Check if all the components are rendered after authenticated
  await waitForElement(() => getByText(/Predictive Services Unit/i))
  expect(getByText(/MoreCast/i)).toBeInTheDocument()
  expect(getByTestId('weather-station-dropdown')).toBeInTheDocument()
})

it('renders weather stations dropdown with data', async () => {
  mockAxios.onGet('/stations/').replyOnce(200, { weather_stations: mockStations })

  const { getByText, getByTestId, store } = renderWithRedux(<FireWeatherPage />)
  expect(selectStations(store.getState()).stations).toEqual([])

  // wait for authentication
  await waitForElement(() => getByText(/Predictive Services Unit/i))

  fireEvent.click(getByTestId('weather-station-dropdown'))

  const [station1] = await waitForElement(() => [
    getByText(`${mockStations[0].name} (${mockStations[0].code})`),
    getByText(`${mockStations[1].name} (${mockStations[1].code})`)
  ])

  fireEvent.click(station1)
  expect(selectStations(store.getState()).stations).toEqual(mockStations)
})

it('renders no data available message if there is no weather data returned', async () => {
  mockAxios.onGet('/stations/').replyOnce(200, { weather_stations: mockStations })
  mockAxios.onPost('/models/GDPS/predictions/').replyOnce(200, emptyModelsResponse)
  mockAxios.onPost('/hourlies/').replyOnce(200, emptyReadingsResponse)
  mockAxios.onPost('/noon_forecasts/').replyOnce(200, emptyForecastsResponse)
  mockAxios
    .onPost('/models/GDPS/predictions/summaries/')
    .replyOnce(200, emptyModelSummariesResponse)
  mockAxios
    .onPost('/noon_forecasts/summaries')
    .replyOnce(200, emptyForecastSummariesResponse)
  mockAxios
    .onPost('/models/GDPS/predictions/historic/most_recent/')
    .replyOnce(200, emptyRecentHistoricModelsResponse)
  mockAxios
    .onPost('/model/GDPS/predictions/most_recent/')
    .replyOnce(200, emptyRecentModelsResponse)

  const { getByText, getByTestId, queryByText, queryByTestId } = renderWithRedux(
    <FireWeatherPage />
  )

  // wait for authentication
  await waitForElement(() => getByText(/Predictive Services Unit/i))

  // Select a weather station
  fireEvent.click(getByTestId('weather-station-dropdown'))
  const station1 = await waitForElement(() =>
    getByText(`${mockStations[0].name} (${mockStations[0].code})`)
  )
  fireEvent.click(station1)

  // Send the request
  fireEvent.click(getByTestId('get-wx-data-button'))

  // Wait for the response
  await waitForElement(() => queryByText(/Data is not available./i))

  // There shouldn't be any display rendered
  expect(
    queryByTestId(`daily-models-table-` + mockStations[0].code)
  ).not.toBeInTheDocument()
  expect(queryByTestId('hourly-readings-display')).not.toBeInTheDocument()
  expect(
    queryByTestId(`noon-forecasts-table-` + mockStations[0].code)
  ).not.toBeInTheDocument()
  expect(queryByTestId('temp-rh-graph')).not.toBeInTheDocument()
})

it('renders error messages in response to network errors', async () => {
  mockAxios.onGet('/stations/').replyOnce(200, { weather_stations: mockStations })
  mockAxios.onPost('/models/GDPS/predictions/').replyOnce(400)
  mockAxios.onPost('/hourlies/').replyOnce(400)
  mockAxios.onPost('/noon_forecasts/').replyOnce(400)
  mockAxios.onPost('/models/GDPS/predictions/summaries/').replyOnce(400)
  mockAxios.onPost('/noon_forecasts/summaries/').replyOnce(400)
  mockAxios.onPost('/models/GDPS/predictions/historic/most_recent/').replyOnce(400)
  mockAxios.onPost('/model/GDPS/predictions/most_recent/').replyOnce(400)

  const { getByText, getByTestId, queryByText } = renderWithRedux(<FireWeatherPage />)

  // wait for authentication
  await waitForElement(() => getByText(/Predictive Services Unit/i))

  // Select a weather station
  fireEvent.click(getByTestId('weather-station-dropdown'))
  const station1 = await waitForElement(() =>
    getByText(`${mockStations[0].name} (${mockStations[0].code})`)
  )
  fireEvent.click(station1)

  // Send the request
  fireEvent.click(getByTestId('get-wx-data-button'))

  // Wait until all the error messages show up
  await waitForElement(() => [
    queryByText(/while fetching global models/i),
    queryByText(/while fetching hourly readings/i),
    queryByText(/while fetching global model summaries/i),
    queryByText(/while fetching noon forecasts/i),
    queryByText(/while fetching noon forecast summaries/i),
    queryByText(/while fetching bias adjusted models/i),
    queryByText(/Data is not available./i)
  ])
})

it('renders daily model, forecast, and hourly values in response to user inputs', async () => {
  mockAxios.onGet('/stations/').replyOnce(200, { weather_stations: mockStations })
  mockAxios.onPost('/models/GDPS/predictions/').replyOnce(200, mockModelsResponse)
  mockAxios.onPost('/hourlies/').replyOnce(200, mockReadingsResponse)
  mockAxios.onPost('/noon_forecasts/').replyOnce(200, mockForecastsResponse)
  mockAxios
    .onPost('/models/GDPS/predictions/summaries/')
    .replyOnce(200, mockModelSummariesResponse)
  mockAxios
    .onPost('/noon_forecasts/summaries/')
    .replyOnce(200, mockForecastSummariesResponse)
  mockAxios
    .onPost('/models/GDPS/predictions/historic/most_recent/')
    .replyOnce(200, mockRecentHistoricModelsResponse)
  mockAxios
    .onPost('/models/GDPS/predictions/most_recent/')
    .replyOnce(200, mockRecentModelsResponse)

  const { getByText, getByTestId, getAllByTestId } = renderWithRedux(<FireWeatherPage />)

  // wait for authentication
  await waitForElement(() => getByText(/Predictive Services Unit/i))

  // Select a weather station
  fireEvent.click(getByTestId('weather-station-dropdown'))
  const station1 = await waitForElement(() =>
    getByText(`${mockStations[0].name} (${mockStations[0].code})`)
  )
  fireEvent.click(station1)

  // Send the request
  fireEvent.click(getByTestId('get-wx-data-button'))

  // Wait until all the displays show up
  await waitForElement(() => [
    getByTestId(`noon-models-table-` + mockStations[0].code),
    getByTestId(`noon-forecasts-table-` + mockStations[0].code),
    getByTestId('hourly-readings-display'),
    getByTestId('temp-rh-graph'),
    getByTestId('wx-graph-reading-toggle'),
    getByTestId('wx-graph-model-toggle'),
    getByTestId('wx-graph-model-summary-toggle'),
    getByTestId('wx-graph-forecast-summary-toggle'),
    getByTestId('wx-graph-bias-toggle')
  ])

  // Check to see if some of SVG are rendered in the graph (dots, area, and tooltip)
  getAllByTestId('hourly-reading-temp-dot')
  getAllByTestId('forecast-summary-temp-line')
  getByTestId('model-summary-temp-area')
  getAllByTestId('historic-model-temp-dot')
  const graphBg = getByTestId('temp-rh-graph-background')
  fireEvent.mouseMove(graphBg)
  fireEvent.mouseLeave(graphBg)

  // There should have been 7 post requests
  // (models, hourly readings, most recent historic models, most recent models, noon forecasts,
  // and two summaries).
  expect(mockAxios.history.post.length).toBe(7)
  // all post requests should include station codes in the body
  mockAxios.history.post.forEach(post => {
    expect(post.data).toBe(
      JSON.stringify({
        stations: [1]
      })
    )
  })
})
