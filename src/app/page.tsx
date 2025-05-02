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
import { ColorModeToggle } from "@/components/ui/color-mode-toggle";
import { fetchSignalData, fetchForecastVariables, fetchMeasurementVariables, VariableInfo } from "@/lib/fetchBoptest";
import TimeSeriesPlotWithStates, { PlotConfig } from "@/components/TimeSeriesPlotWithStates";

export default function Page() {

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

  const dummyForecastVar = forecastVariables.length > 0 ? forecastVariables[0].name : "UpperSetp[1]"
  const fetchData = async (pc: PlotConfig) => fetchSignalData(pc, dummyForecastVar)

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
      <TimeSeriesPlotWithStates
        fetchSignalData={fetchData}
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