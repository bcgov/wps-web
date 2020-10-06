const stationCode = 209

describe('MoreCast Page', () => {
  beforeEach(() => {
    cy.server()
    cy.route('GET', 'api/stations/', 'fixture:weather-stations.json').as('getStations')
    cy.visitProtectedPage('/morecast')
  })

  it('if network errors occurred', () => {
    cy.wait('@getStations')

    cy.selectStationByCode(stationCode)
    cy.getByTestId('get-wx-data-button').click()

    cy.checkErrorMessage('Error occurred (while fetching global models).')
    cy.checkErrorMessage('Error occurred (while fetching hourly readings).')
    cy.checkErrorMessage('Error occurred (while fetching global model summaries).')
    cy.checkErrorMessage('Error occurred (while fetching noon forecasts).')
    cy.checkErrorMessage('Error occurred (while fetching noon forecast summaries).')
    cy.checkErrorMessage('Error occurred (while fetching bias-adjusted models).')
  })

  it('if all the weather data were successfully fetched', () => {
    cy.route('POST', 'api/hourlies/', 'fixture:weather-data/observed-actuals')
    cy.route('POST', 'api/models/GDPS/predictions/', 'fixture:weather-data/future-models')
    cy.route('POST', 'api/models/GDPS/predictions/historic/most_recent/', 'fixture:weather-data/past-most-recent-models') // prettier-ignore
    cy.route('POST', 'api/models/GDPS/predictions/most_recent', 'fixture:weather-data/past-most-recent-models-with-biased-adjusted') // prettier-ignore
    cy.route('POST', 'api/models/GDPS/predictions/summaries/', 'fixture:weather-data/past-model-summaries')
    cy.route('POST', 'api/noon_forecasts/', 'fixture:weather-data/forecasts')
    cy.route('POST', 'api/noon_forecasts/summaries/', 'fixture:weather-data/past-forecast-variations')

    cy.wait('@getStations')

    // Request the weather data
    cy.selectStationByCode(stationCode)
    cy.getByTestId('get-wx-data-button').click()

    // Check if svg elements are displayed in the graph
    cy.getByTestId('model-summary-temp-area')
    cy.getByTestId('hourly-reading-temp-dot')
    cy.getByTestId('historic-model-temp-dot')
    cy.getByTestId('forecast-temp-dot')
    cy.getByTestId('forecast-summary-temp-line')

    // Test the toggle buttons
    cy.getByTestId('wx-graph-model-toggle').click()
    cy.getByTestId('model-temp-dot')
    cy.getByTestId('wx-graph-model-toggle').click()
    cy.getByTestId('model-temp-dot').should('not.exist')
    cy.getByTestId('wx-graph-bias-toggle').click()
    cy.getByTestId('bias-adjusted-model-temp-dot')
    cy.getByTestId('wx-graph-bias-toggle').click()
    cy.getByTestId('bias-adjusted-model-temp-dot').should('not.exist')

    // Hover over the first dot and check if the tooltip shows up with the correct text
    cy.getByTestId('hourly-reading-temp-dot')
      .first()
      .trigger('mousemove', { force: true, x: 4, y: 1 })
    cy.getByTestId('temp-rh-tooltip-text')
      .should('contain', '3:00 pm, Thu, Oct 1st (PDT, UTC-7)')
      .and('contain', 'Temp: - (°C)')
      .and('contain', 'RH: 38 (%)')
  })
})
