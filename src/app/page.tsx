"use client";

import {
  Box,
  ClientOnly,
  HStack,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TestcaseMeta from "@/components/TestcaseMeta";
import TimeSeriesPlot from "@/components/TimeSeriesPlot";
import { ColorModeToggle } from "@/components/ui/color-mode-toggle";
import { fetchForecastData, fetchForecastVariables, fetchMeasurementData, fetchMeasurementVariables, TimeSeriesData, VariableInfo } from "@/lib/fetchBoptest";
import SignalSelector from "@/components/SignalSelector";
import type { SignalConfig } from "@/components/SignalPlotConfigurator"
import SignalPlotConfigurator from "@/components/SignalPlotConfigurator";
import TimeSeriesPlotWithSelector from "@/components/TimeSeriesPlotWithSelector";

export default function Page() {
  const [forecastData, setForecastData] = useState<TimeSeriesData[]>([]);

  useEffect(() => {
    const loadForecastData = async () => {
      const data = await fetchForecastData(["LowerSetp[1]", "UpperSetp[1]"]);
      setForecastData(data);
    };

    loadForecastData();
  }, []);

  const [measurementVariables, setMeasurementVariables] = useState<VariableInfo[]>([]);
  const [forecastVariables, setForecastVariables] = useState<VariableInfo[]>([]);

  useEffect(() => {
    const fetchVariables = async () => {
      const measurementVars = await fetchMeasurementVariables();
      setMeasurementVariables(measurementVars);

      const forecastVars = await fetchForecastVariables();
      setForecastVariables(forecastVars);
    };

    fetchVariables();
  }, []);

  const fetchSignalData = async (signals: string[]) => {
    /* For each signal:
    1. Check whether it's in measurementVariables or forecastVariables
    2. If it's in measurementVariables, fetch the measurement data
    3. If it's in forecastVariables, fetch the forecast data
    */
    const measurementSignals = signals.filter(signal =>
      measurementVariables.some(variable => variable.name === signal)
    );
    const forecastSignals = signals.filter(signal =>
      forecastVariables.some(variable => variable.name === signal)
    );
    const forecastData = await fetchForecastData(forecastSignals);
    
    // Check plant time
    let t0 = 0;
    if (forecastData.length > 0) {
      t0 = forecastData[0].x[0]
    } else {
      const dummySignals = [forecastVariables[0].name];
      const dummyForecast = await fetchForecastData(dummySignals, 0, 3600);
      t0 = dummyForecast[0].x[0];
    }

    const measurementData = await fetchMeasurementData(measurementSignals, 0, t0);

    // Return an array of TimeSeriesData
    const allData = [...measurementData, ...forecastData];
    return allData;
  }


  return (
    <>
      <HStack align="start" gap={0}>
        <VStack
          width="25%"
          borderRight="1px solid #e2e8f0"
          align="left"
          height="100vh" // Set the height to fill the viewport
          overflowY="auto" // Enable vertical scrolling
        >
          <TestcaseMeta
            measurementVariables={measurementVariables}
            forecastVariables={forecastVariables}
            serverUrl="http://127.0.0.1:5000"
          />
        </VStack>
      <TimeSeriesPlotWithSelector
        measurementVariables={measurementVariables}
        forecastVariables={forecastVariables}
        fetchSignalData={fetchSignalData}
      />
      </HStack>
      <Box pos="absolute" top="4" right="4">
        <ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
          <ColorModeToggle />
        </ClientOnly>
      </Box>
    </>
  );
}