import { putForecast } from "@/client/sdk.gen";

export type ForecastData = {
  x: number[];
  y: number[];
  name: string;
};

export const fetchForecastData = async (
  point_names: string[],
  horizon: number = 86400,
  interval: number = 3600
): Promise<ForecastData[]> => {
  try {
    const response = await putForecast({
      body: {
        point_names,
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