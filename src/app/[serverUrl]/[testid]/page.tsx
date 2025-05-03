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
import TimeSeriesPlotWithStates from "@/components/TimeSeriesPlotWithStates";


interface LineStyleConfig  {
  lineStyle: "solid" | "dot" | "dash";
  lineWidth: number;
  color: string;
}

interface SignalDisplayConfig {
  horizon: number;
  interval: number;
  signals: Array<{
    name: string;
    lineStyleConfig: LineStyleConfig;
  }>
}

export interface PlotConfig {
  measurement: SignalDisplayConfig;
  forecast: SignalDisplayConfig;
}

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

  const [selectedSignals, setSelectedSignals] = useState<PlotConfig[] | null>(null);

  // Fetch initial signals from JSON file
  useEffect(() => {
    const fetchInitialSignals = async () => {
      try {
        const response = await fetch("/defaultConfigs/bestest_hydronic_heat_pump.json");
        const jsonData: PlotConfig[] = await response.json();
        setSelectedSignals(jsonData);

      } catch (error) {
        console.error("Error loading initial signals:", error);
      }
    };

    fetchInitialSignals();
  }, []);  

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
        <VStack width="75%" gap={4}>
          {selectedSignals?.map((signalConfig, index) => (
            <TimeSeriesPlotWithStates
              key={index}
              selectedSignals={signalConfig}
              fetchSignalData={fetchData}
              updateInterval={updateInterval} // Pass update frequency as a prop
            />
          ))}
        </VStack>
      </HStack>
      <Box pos="absolute" top="4" right="4">
        <ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
          <ColorModeToggle />
        </ClientOnly>
      </Box>
    </>
  );
}