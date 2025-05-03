"use client";

import {
  Box,
  ClientOnly,
  HStack,
  Skeleton,
  VStack,
  NumberInput,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TestcaseMeta from "@/components/TestcaseMeta";
import { ColorModeToggle } from "@/components/ui/color-mode-toggle";
import { fetchSignalData, fetchForecastVariables, fetchMeasurementVariables, VariableInfo } from "@/lib/fetchBoptest";
import TimeSeriesPlotWithStates, { PlotConfig } from "@/components/TimeSeriesPlotWithStates";

export default function Page() {
  const [measurementVariables, setMeasurementVariables] = useState<VariableInfo[]>([]);
  const [forecastVariables, setForecastVariables] = useState<VariableInfo[]>([]);
  const [updateInterval, setUpdateInterval] = useState<string>("5000"); // Manage update frequency here

  const params = useParams();
  const { serverUrl, testid } = params; // Extract serverUrl and testId from the URL
  const fullServerUrl = `http://${serverUrl}`;

  useEffect(() => {
    if (!fullServerUrl || !testid) return; // Wait until both parameters are available

    const fetchVariables = async () => {
      const measurementVars = await fetchMeasurementVariables(fullServerUrl as string, testid as string);
      setMeasurementVariables(measurementVars);

      const forecastVars = await fetchForecastVariables(fullServerUrl as string, testid as string);
      setForecastVariables(forecastVars);
    };

    fetchVariables();
  }, [fullServerUrl, testid]);

  const dummyForecastVar = forecastVariables.length > 0 ? forecastVariables[0].name : "UpperSetp[1]";
  const fetchData = async (pc: PlotConfig) => fetchSignalData(
    fullServerUrl as string, testid as string, pc, dummyForecastVar
  );

  const handleUpdateIntervalChange = (value: string) => {
    const interval = parseInt(value, 10);
    if (!isNaN(interval) && interval >= 1000) {
      setUpdateInterval(value);
    }
  };

  return (
    <>
      <HStack align="start" gap={0}>
        <VStack
          maxW="25%"
          borderRight="1px solid #e2e8f0"
          align="left"
          height="100vh" // Set the height to fill the viewport
          overflowY="auto" // Enable vertical scrolling
        >
          <NumberInput.Root
            maxW="200px"
            value={updateInterval}
            onValueChange={(e) => handleUpdateIntervalChange(e.value)}
            size="sm"
            step={1000}
          >
            <NumberInput.Label>
              <Text textStyle="sm">Update frequency (ms)</Text>
            </NumberInput.Label>
            <NumberInput.Control />
            <NumberInput.Input />
          </NumberInput.Root>
          <TestcaseMeta
            measurementVariables={measurementVariables}
            forecastVariables={forecastVariables}
            serverUrl={fullServerUrl} // Add protocol back for display
            testId={testid as string}
          />
        </VStack>
        <TimeSeriesPlotWithStates
          fetchSignalData={fetchData}
          updateInterval={updateInterval} // Pass update frequency as a prop
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