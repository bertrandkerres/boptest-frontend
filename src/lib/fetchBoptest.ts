import { getForecastPoints, getInputs, getMeasurements, getStep, putForecast, putResults } from "@/client/sdk.gen";

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
    const response = await putForecast({
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
  pointNames: string[],
  startTime: number,
  finalTime: number,
  stepsize: number = 0
): Promise<TimeSeriesData[]> => {
  const body = {
    point_names: pointNames,
    start_time: startTime,
    final_time: finalTime,
  };
  console.log("Querying /results: ", body);

  try {
    const response = await putResults({
      body: body,
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

export const fetchMeasurementVariables = async (): Promise<VariableInfo[]> => {
  try {
    const measurements = await getMeasurements();
    const inputs = await getInputs();

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

export const fetchForecastVariables = async (): Promise<VariableInfo[]> => {
  try {
    const forecastPoints = await getForecastPoints();

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

