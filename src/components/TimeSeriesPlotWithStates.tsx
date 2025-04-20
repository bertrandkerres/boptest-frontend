"use client";

import { useEffect, useState } from "react";
import {
  VStack,
  NumberInput,
  Text
} from "@chakra-ui/react";
import TimeSeriesPlot from "@/components/TimeSeriesPlot";

interface SignalConfig {
  name: string;
  lineStyle: "solid" | "dot" | "dash";
  lineWidth: number;
  color: string;
}

interface TimeSeriesPlotWithStatesProps {
  fetchSignalData: (signalNames: string[]) => Promise<Array<{ name: string; x: number[]; y: number[] }>>;
}

const TimeSeriesPlotWithStates = ({
  fetchSignalData,
}: TimeSeriesPlotWithStatesProps) => {
  const [selectedSignals, setSelectedSignals] = useState<SignalConfig[]>([]);
  const [plotData, setPlotData] = useState<Array<{ name: string; x: number[]; y: number[] }>>([]);
  const [updateInterval, setUpdateInterval] = useState<string>("5000");

  // Fetch initial signals from JSON file
  useEffect(() => {
    const fetchInitialSignals = async () => {
      try {
        const response = await fetch("defaultConfigs/bestest_hydronic_heat_pump.json"); // Update the path as needed
        const data: SignalConfig[] = await response.json();
        setSelectedSignals(data);

        // Initialize plotData based on the fetched signals
        const initPlotData = data.map((s) => ({
          name: s.name,
          x: [],
          y: [],
        }));
        setPlotData(initPlotData);
      } catch (error) {
        console.error("Error loading initial signals:", error);
      }
    };

    fetchInitialSignals();
  }, []);

  const handleUpdateIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateInterval(event.target.value);
  };

  useEffect(() => {
    const updateAllSignalData = async () => {
      const allSignalNames = plotData.map((data) => data.name);
      if (allSignalNames.length > 0) {
        const updatedSignalData = await fetchSignalData(allSignalNames);
        setPlotData(updatedSignalData);
      }
    };

    let updateIntervalMs = parseInt(updateInterval, 10);
    if (isNaN(updateIntervalMs) || updateIntervalMs < 1000) updateIntervalMs = 5000;
    const intervalId = setInterval(updateAllSignalData, updateIntervalMs);

    return () => clearInterval(intervalId);
  }, [plotData, fetchSignalData, updateInterval]);

  return (
    <VStack width="100%">
      <NumberInput.Root
        value={updateInterval}
        onChange={handleUpdateIntervalChange}
        size="xs"
      >
        <NumberInput.Label><Text textStyle="xs">Update frequency (ms)</Text></NumberInput.Label>
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
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
    </VStack>
  );
};

export default TimeSeriesPlotWithStates;