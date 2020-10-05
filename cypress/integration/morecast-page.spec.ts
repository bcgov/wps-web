const stationCode = 317

describe('MoreCast Page', () => {
  beforeEach(() => {
    cy.server()
    cy.route('GET', 'api/stations/', 'fixture:weather-stations.json').as('getStations')
    cy.visitProtectedPage('/fire-weather')
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
    cy.route('POST', 'api/models/GDPS/predictions/summaries/', 'fixture:weather-data/past-model-summaries')
    cy.route('POST', 'api/noon_forecasts/', 'fixture:weather-data/past-future-forecasts')
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

    // Test the attached tooltip
    cy.getByTestId('temp-rh-graph-background').trigger('mousemove')
    cy.getByTestId('temp-rh-tooltip-text')
      .should('contain', '10:00 pm, Thu, Oct 1st (PDT, UTC-7)')
      .and('contain', 'Temp: 9 (°C)')
      .and('contain', 'RH: 97 (%)')

    // Test one of toggle buttons
    cy.getByTestId('wx-graph-model-toggle').click()
    cy.getByTestId('model-temp-dot')
  })
})
