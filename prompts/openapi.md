Create an OpenAPI 3.0.3 specification for a REST API called 'BOPTEST Service API'. The API is used for emulating buildings for testing control systems. Include the following:

# General Information:

* Title: BOPTEST Service API
* Description: A REST API for emulating buildings for testing control systems.
* Version: 1.0.0
* Server URL: http://127.0.0.1:5000 (local server)

# Components:

Define schemas for:
* BoundedSignalMeta: Contains Description, Maximum, Minimum, and Unit properties.
* SignalMeta: Contains Description and Unit properties.
* BoundedSignalMetaResponse: An object with additional properties referencing BoundedSignalMeta.
* SignalMetaResponse: An object with additional properties referencing SignalMeta.
* ForecastQuery: Contains point_names (array of strings), horizon (number), and interval (number).
* ResultsQuery: Contains point_names (array of strings), start_time (number), and final_time (number).
* TimeSeries: An object with additional properties that are arrays of numbers.
* StandardResponse: Contains message (string), payload (object), and status (integer).

# Paths:
* /inputs: A GET endpoint to retrieve metadata for input signals.
* /measurements: A GET endpoint to retrieve metadata for measurement signals.
* /forecast_points: A GET endpoint to retrieve metadata for forecast point signals.
* /forecast: A PUT endpoint to submit a forecast query and return a TimeSeries response.
* /results: A PUT endpoint to submit a results query and return a TimeSeries response.
* /advance: A POST endpoint to advance the simulation with optional input overwrites.
* /step: A GET endpoint to retrieve the simulation time step and a PUT endpoint to set the simulation time step.
* /scenario: A GET endpoint to retrieve the current scenario description.
* /kpi: A GET endpoint to retrieve Key Performance Indicators (KPIs).
* /initialize: A PUT endpoint to initialize the simulation with a start time and warmup period.

# Response Structure:
All 200 responses should include:
* message: A string describing the response.
* payload: The actual response data.
* status: The HTTP status code.

Ensure the specification is well-structured and adheres to OpenAPI 3.0.3 standards.