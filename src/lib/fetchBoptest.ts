import { getForecastPoints, getInputs, getMeasurements, getStep, putForecast, putResults } from "@/client/sdk.gen";

export type TimeSeriesData = {
  x: number[];
  y: number[];
  name: string;
};

export const fetchForecastData = async (
  pointNames: string[],
  horizon: number = 86400,
  interval: number = 3600
): Promise<TimeSeriesData[]> => {
  try {
    const response = await putForecast({
      body: {
        point_names: pointNames,
        horizon,
        interval,
      },
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
  pointNames: string[],
  startTime: number,
  finalTime: number,
  stepsize: number = 0
): Promise<TimeSeriesData[]> => {
  try {
    const response = await putResults({
      body: {
        point_names: pointNames,
        start_time: startTime,
        final_time: finalTime,
      },
    });

    if (response.data?.payload) {
      const { time, ...signals } = response.data.payload;

      if (time.length > 1) {
        const dt = time[1] - time[0]; // Calculate the step size from the time array

        // Handle default value for stepsize
        if (stepsize === 0) {
          const r = await getStep();
          if (r.data?.payload) stepsize = r.data.payload;
        }

        if (stepsize <= dt) {
          // If no resampling is needed, return the original time series
          return Object.entries(signals).map(([name, values]) => ({
            name,
            x: time,
            y: values,
          }));
        }

        // Resample the time series if stepsize > dt
        const n = Math.round(stepsize / dt); // Calculate the resampling factor

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

export const fetchMeasurementVariables = async () => {
  try {
    // Fetch measurement variables
    const measurements = await getMeasurements();
    const inputs = await getInputs();

    const measurementNames = Object.keys(measurements.data?.payload || {});
    const inputNames = Object.keys(inputs.data?.payload || {}).filter(
      (name) => !name.endsWith("_activate")
    );

    return [...measurementNames, ...inputNames];

  } catch (error) {
    console.error("Error fetching variables:", error);
    return [];
  }
};

export const fetchForecastVariables = async () => {
  try {
    // Fetch forecast variables
    const forecastPoints = await getForecastPoints();
    const forecastPointNames = Object.keys(forecastPoints.data?.payload || {});
    return forecastPointNames;
  } catch (error) {
    console.error("Error fetching variables:", error);
    return [];
  }
};

