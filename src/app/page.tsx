"use client";

import {
  Box,
  ClientOnly,
  HStack,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ParentVariableSelection from "@/components/ParentVariableSelection";
import TimeSeriesPlot from "@/components/TimeSeriesPlot";
import { ColorModeToggle } from "@/components/ui/color-mode-toggle";
import { fetchForecastData, fetchForecastVariables, fetchMeasurementVariables, TimeSeriesData, VariableInfo } from "@/lib/fetchBoptest";
import TestCaseMetadata from "@/components/TestCaseMeta";
import SignalSelector from "@/components/SignalSelector";
import type { SignalConfig } from "@/components/SignalPlotConfigurator"
import SignalPlotConfigurator from "@/components/SignalPlotConfigurator";

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

  const [selectedSignals, setSelectedSignals] = useState<SignalConfig[]>([]);

  const updateSelectedSignals = (signalNames: string[]) => {
    setSelectedSignals((prevSelectedSignals) => {
      // Add new SignalConfigurations for signal names not already in the state
      const newSignals = signalNames
        .filter((signalName) => !prevSelectedSignals.some((signal) => signal.name === signalName))
        .map((signalName) => ({
          name: signalName,
          lineStyle: "solid" as "solid", // Default line style
          lineWidth: 2, // Default line width
          color: "#000000", // Default color
        }));
  
      // Filter out SignalConfigurations for signals not in the input array
      const filteredSignals = prevSelectedSignals.filter((signal) =>
        signalNames.includes(signal.name)
      );
  
      // Combine the filtered existing signals with the new ones
      return [...filteredSignals, ...newSignals];
    });
  };

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
          <TestCaseMetadata serverUrl="http://127.0.01:5000" />
          <ParentVariableSelection />
        </VStack>
        {forecastData.length > 0 ? (
          <TimeSeriesPlot
            title="Forecast Time Series"
            data={forecastData}
            yAxisLabel="Value"
          />
        ) : (
          <Skeleton height="400px" />
        )}
        <Box flex="1" p={4}>
          <SignalSelector
            measurementVariables={measurementVariables}
            forecastVariables={forecastVariables}
            onSelectSignal={updateSelectedSignals}
          />
          <SignalPlotConfigurator selectedSignals={selectedSignals} onUpdateSignal={(e1:any, e2: any) => {}}/>
        </Box>
      </HStack>
      <Box pos="absolute" top="4" right="4">
        <ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
          <ColorModeToggle />
        </ClientOnly>
      </Box>
    </>
  );
}