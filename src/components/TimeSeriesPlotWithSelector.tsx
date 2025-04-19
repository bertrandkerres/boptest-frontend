"use client";

import { useEffect, useState } from "react";
import {
  VStack,
  Box,
  HStack,
  NumberInput,
  Text
} from "@chakra-ui/react";
import TimeSeriesPlot from "@/components/TimeSeriesPlot";
import { VariableInfo } from "@/lib/fetchBoptest";
import SignalSelector from "./SignalSelector";
import SignalPlotConfigurator from "./SignalPlotConfigurator";

interface SignalConfig {
  name: string;
  lineStyle: "solid" | "dot" | "dash";
  lineWidth: number;
  color: string;
}

interface TimeSeriesPlotWithSelectorProps {
  measurementVariables: VariableInfo[];
  forecastVariables: VariableInfo[];
  fetchSignalData: (signalNames: string[]) => Promise<Array<{ name: string; x: number[]; y: number[] }>>;
}

const TimeSeriesPlotWithSelector = ({
  measurementVariables,
  forecastVariables,
  fetchSignalData,
}: TimeSeriesPlotWithSelectorProps) => {

  const [selectedSignals, setSelectedSignals] = useState<SignalConfig[]>([]);
  const [plotData, setPlotData] = useState<Array<{ name: string; x: number[]; y: number[] }>>([]);
  const [updateInterval, setUpdateInterval] = useState<string>("2000"); // Default to 2000ms

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

  const onUpdateSignal = (index: number, updatedConfig: Partial<SignalConfig>) => {
    setSelectedSignals((prevSelectedSignals) => {
      // Create a copy of the current state
      const updatedSignals = [...prevSelectedSignals];

      // Update the specific signal configuration at the given index
      updatedSignals[index] = { ...updatedSignals[index], ...updatedConfig };

      // Return the updated state
      return updatedSignals;
    });
  };

  const handleUpdateIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateInterval(event.target.value);
  };

  useEffect(() => {
    const fetchNewSignalData = async () => {
      // Get the names of the currently selected signals
      const currentSignalNames = selectedSignals.map((signal) => signal.name);

      // Get the names of the signals already in plotData
      const existingSignalNames = plotData.map((data) => data.name);

      // Find the new signals that are not yet in plotData
      const newSignalNames = currentSignalNames.filter(
        (name) => !existingSignalNames.includes(name)
      );

      // Fetch data for the new signals
      if (newSignalNames.length > 0) {
        console.log(newSignalNames)
        const newSignalData = await fetchSignalData(newSignalNames);

        // Update plotData with the new signal data
        setPlotData((prevPlotData) => [...prevPlotData, ...newSignalData]);
      }
    };

    fetchNewSignalData();
  }, [selectedSignals]);

  useEffect(() => {
    const updateAllSignalData = async () => {
      // Get the names of all signals currently in plotData
      const allSignalNames = plotData.map((data) => data.name);

      // Fetch updated data for all signals
      if (allSignalNames.length > 0) {
        const updatedSignalData = await fetchSignalData(allSignalNames);

        // Update plotData with the new signal data
        setPlotData(updatedSignalData);
      }
    };

    // Set an interval to update the data based on the updateInterval state
    let updateIntervalMs = parseInt(updateInterval, 10);
    if (isNaN(updateIntervalMs) || updateIntervalMs < 1000)
      updateIntervalMs = 1000;
    const intervalId = setInterval(updateAllSignalData, updateIntervalMs);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [plotData, fetchSignalData, updateInterval]);

  return (
    <HStack width="100%">
      <Box flex="1" maxWidth="800px">
        <TimeSeriesPlot
          title="Time Series Plot"
          data={plotData.map((data) => {
            const config = selectedSignals.find((signal) => signal.name === data.name);
            return {
              ...data,
              lineStyle: config?.lineStyle,
              lineWidth: config?.lineWidth,
              color: config?.color,
            };
          })}
          yAxisLabel="Value"
        />
      </Box>
      <VStack flex="1" maxWidth="300px" align="start">
          <NumberInput.Root
            value={updateInterval}
            onChange={handleUpdateIntervalChange}
            size="xs"
          >
            <NumberInput.Label><Text textStyle="xs">Update frequency (ms)</Text></NumberInput.Label>
            <NumberInput.Control />
            <NumberInput.Input />
          </NumberInput.Root>
        <SignalSelector
          measurementVariables={measurementVariables}
          forecastVariables={forecastVariables}
          onSelectSignal={updateSelectedSignals}
        />
        <SignalPlotConfigurator selectedSignals={selectedSignals} onUpdateSignal={onUpdateSignal}/>
      </VStack>
    </HStack>
  );
};

export default TimeSeriesPlotWithSelector;