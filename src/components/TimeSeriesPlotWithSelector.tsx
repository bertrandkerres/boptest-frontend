"use client";

import { useEffect, useState } from "react";
import {
  VStack,
  Box,
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

  const [plotData, setPlotData] = useState<Array<{ name: string; x: number[]; y: number[] }>>([]);

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
        const newSignalData = await fetchSignalData(newSignalNames);

        // Update plotData with the new signal data
        setPlotData((prevPlotData) => [...prevPlotData, ...newSignalData]);
      }
    };

    fetchNewSignalData();
  }, [selectedSignals, fetchSignalData, plotData]);


  return (
    <>
      <Box flex="1" p={4}>
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
      <VStack flex="1" p={4}>
        <SignalSelector
          measurementVariables={measurementVariables}
          forecastVariables={forecastVariables}
          onSelectSignal={updateSelectedSignals}
        />
        <SignalPlotConfigurator selectedSignals={selectedSignals} onUpdateSignal={onUpdateSignal}/>
      </VStack>
    </>
  );
};

export default TimeSeriesPlotWithSelector;