import { getForecastPointsByTestid, getInputsByTestid, getMeasurementsByTestid, getStepByTestid, putForecastByTestid, putResultsByTestid } from "@/client/sdk.gen";
import { PlotConfig } from "@/components/TimeSeriesPlotWithStates";

export type TimeSeriesData = {
  x: number[];
  y: number[];
  name: string;
};

export type VariableInfo = {
  name: string;
  description: string;
  unit: string;
};

export const fetchForecastData = async (
  serverUrl: string,
  testId: string,
  pointNames: string[],
  horizon: number = 86400,
  interval: number = 3600
): Promise<TimeSeriesData[]> => {
  const body = {
    point_names: pointNames,
    horizon,
    interval,
  };
  console.log("Querying /forecast: ", body);

  try {
    const response = await putForecastByTestid({
      path: {testid: testId},
      body: body,
    });

    if (response.data?.payload) {
      const { time, ...signals } = response.data.payload;

      return Object.entries(signals).map(([name, values]) => ({
        name,
        x: time,
        y: values,
      }));
    }
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }

  return [];
};

export const fetchMeasurementData = async (
  serverUrl: string,
  testId: string,
  pointNames: string[],
  startTime: number,
  finalTime: number,
  interval: number = 0
): Promise<TimeSeriesData[]> => {
  const body = {
    point_names: pointNames,
    start_time: startTime,
    final_time: finalTime,
  };
  console.log("Querying /results: ", body);

  try {
    const response = await putResultsByTestid({
      path: {testid: testId},
      body: body,
    });

    if (response.data?.payload) {
      const { time, ...signals } = response.data.payload;

      if (time.length > 1) {
        const dt = time[1] - time[0]; // Calculate the step size from the time array

        // Handle default value for stepsize
        if (interval === 0) {
          const r = await getStepByTestid({path: {testid: testId}});
          if (r.data?.payload) interval = r.data.payload;
        }

        if (interval <= dt) {
          // If no resampling is needed, return the original time series
          return Object.entries(signals).map(([name, values]) => ({
            name,
            x: time,
            y: values,
          }));
        }

        // Resample the time series if stepsize > dt
        const n = Math.round(interval / dt); // Calculate the resampling factor

        // Resample the time array
        const resampledTime = time.filter((_, index) => index % n === 0);

        // Resample each signal
        const resampledSignals = Object.entries(signals).reduce(
          (acc, [name, values]) => {
            acc[name] = values.filter((_, index) => index % n === 0);
            return acc;
          },
          {} as Record<string, number[]>
        );

        return Object.entries(resampledSignals).map(([name, values]) => ({
          name,
          x: resampledTime,
          y: values,
        }));
      }

    }
  } catch (error) {
    console.error("Error fetching results data:", error);
  }

  return [];
};

export const fetchSignalData = async (
  serverUrl: string,
  testId: string,
  plotConfig: PlotConfig,
  dummyVarName: string
): Promise<Array<{ name: string; x: number[]; y: number[] }>> => {
  try {

    // Fetch data for all forecast signals
    const forecastPromises = plotConfig.forecast.signals.map((signal) =>
      fetchForecastData(
        serverUrl,
        testId,
        [signal.name], // Pass the signal name as an array
        plotConfig.forecast.horizon, // Horizon
        plotConfig.forecast.interval // Interval
      ).then((data) => ({
        name: signal.name,
        x: data[0]?.x || [],
        y: data[0]?.y || [],
      }))
    );
    const forecastData = await Promise.all(forecastPromises);

    // Check plant time
    let t_plant = 0;
    if (forecastData.length > 0) {
      t_plant = forecastData[0].x[0]
    } else {
      const dummySignals = [dummyVarName];
      const dummyForecast = await fetchForecastData(
        serverUrl, testId, dummySignals, 7200, 3600
      );
      t_plant = dummyForecast[0].x[0];
    }

    // Fetch data for all measurement signals
    const t_start = Math.max(t_plant + plotConfig.measurement.horizon, 0);
    const measurementPromises = plotConfig.measurement.signals.map((signal) =>
      fetchMeasurementData(
        serverUrl,
        testId,
        [signal.name], // Pass the signal name as an array
        t_start, // Start time
        t_plant,
        plotConfig.measurement.interval // Interval
      ).then((data) => ({
        name: signal.name,
        x: data[0]?.x || [],
        y: data[0]?.y || [],
      }))
    );


    // Wait for all promises to resolve
    const measurementData = await Promise.all(measurementPromises);

    // Combine the results
    return [...measurementData, ...forecastData];
  } catch (error) {
    console.error("Error fetching signal data:", error);
    return [];
  }
};


export const fetchMeasurementVariables = async (serverUrl: string, testId: string): Promise<VariableInfo[]> => {
  try {
    const measurements = await getMeasurementsByTestid({path: {testid: testId}});
    const inputs = await getInputsByTestid({path: {testid: testId}});

    const measurementVariables = Object.entries(measurements.data?.payload || {}).map(
      ([name, { Description, Unit }]) => ({
        name,
        description: Description || "No description available",
        unit: Unit || "",
      })
    );

    const inputVariables = Object.entries(inputs.data?.payload || {})
      .filter(([name]) => !name.endsWith("_activate"))
      .map(([name, { Description, Unit }]) => ({
        name,
        description: Description || "No description available",
        unit: Unit || "",
      }));

    return [...measurementVariables, ...inputVariables];
  } catch (error) {
    console.error("Error fetching measurement variables:", error);
    return [];
  }
};

export const fetchForecastVariables = async (server: string, testid: string): Promise<VariableInfo[]> => {
  try {
    const forecastPoints = await getForecastPointsByTestid({path: {testid: testid}});

    return Object.entries(forecastPoints.data?.payload || {}).map(
      ([name, { Description, Unit }]) => ({
        name,
        description: Description || "No description available",
        unit: Unit || "",
      })
    );
  } catch (error) {
    console.error("Error fetching forecast variables:", error);
    return [];
  }
};

