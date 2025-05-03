# BOPTEST-Frontend
This is a simple frontend to visualize building simulations running in BOPTEST.

## Usage

### Installation
Currently, this is only meant for local usage.
You need [NodeJS](https://nodejs.org/en/download) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to run this locally.

Install the required packages from the project root:
```bash
npm install
```

### Running the frontend
Run the server: Dev version (slow execution, automatic recompilation for source code changes)
```bash
npm run dev
```

or production version (pre-compiled, fast execution, somewhat stricter w.r.t. linting etc.)
```bash
npm run build # One-time, to compile
npm run start
```

### Connecting to a testcase
> [!IMPORTANT]
> This frontend assumes the BOPTEST-Service API, as used from version `v0.7.0`.

> [!WARNING]
> BOPTEST currently does not support [CORS headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) per default. So you have to start your browser with disabled origin checks ([example for Chrome](https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome)).

The frontend base URL per default is `http://localhost:3000`. In order to connect to a testcase, you need to add the BOPTEST server (without `http://` protocol specifier), and the `testId` as path parameters. So the complete URL is `http://localhost:3000/{boptestServer}/{testId}`.

For example, if you run BOPTEST on `localhost`, and your test case id is `aaa-bbb-ccc-ddd`, then open 
[http://localhost:3000/localhost/aaa-bbb-ccc-ddd](http://localhost:3000/localhost/aaa-bbb-ccc-ddd) with your browser to fetch data for this test case.


### Configuring the plots
Currently, plots are configured using JSON files with the test case name, stored in the `public/defaultConfigs` folder. The frontend will query the test case name, and load the corresponding configuration automatically.
The JSON file needs to return an array of objects as defined below.

> [!WARNING]
> Please note that the comments `// ...` are invalid json, so they have to be removed in the actual file.

```json
[
  // The following is an example of one PlotConfig object
  {
    "title": "string",
    "measurement": {
        "horizon": -87600, // Note: Negative values to look back in time
        "interval": 3600,
        "signals": [
            {
                "name": "string", // Match test case signal, e.g. "reaTZon_y"
                "lineStyleConfig": {"lineStyle": "dot", "lineWidth": 1, "color": "black" }
            }
        ]
    },
    "forecast": [], // same schema as "measurement", but with positive values for "horizon"
    "yLabel": "string"
  }
]
```

Each array item describes one plot. The plots are stacked vertically in order of appearance in the JSON configuration.

## Tech stack
* [Typescript](https://www.typescriptlang.org/docs/)
* [React](https://react.dev/) + [Next.js](https://nextjs.org) for states, routing, etc.
* [ChakraUI](https://chakra-ui.com/) for styling.
* [heyapi](https://heyapi.dev/) for automatic client generation.
* [plotly](https://plotly.com/javascript/) for the plots.



