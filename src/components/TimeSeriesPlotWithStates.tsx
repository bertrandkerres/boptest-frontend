"use client";

import { useEffect, useState } from "react";
import {
  VStack,
  NumberInput,
  Text
} from "@chakra-ui/react";
import TimeSeriesPlot from "@/components/TimeSeriesPlot";

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

export interface TimeSeriesPlotWithStatesProps {
  fetchSignalData: (plotConfig: PlotConfig) => Promise<Array<{ name: string; x: number[]; y: number[] }>>;
}


const TimeSeriesPlotWithStates = ({
  fetchSignalData,
}: TimeSeriesPlotWithStatesProps) => {
  const [selectedSignals, setSelectedSignals] = useState<PlotConfig | null>(null);
  const [plotData, setPlotData] = useState<Array<{ name: string; x: number[]; y: number[] }>>([]);
  const [updateInterval, setUpdateInterval] = useState<string>("5000");

  // Fetch initial signals from JSON file
  useEffect(() => {
    const fetchInitialSignals = async () => {
      try {
        const response = await fetch("defaultConfigs/bestest_hydronic_heat_pump.json");
        const jsonData: PlotConfig[] = await response.json();
        const data = jsonData[0];
        setSelectedSignals(data);

        // Initialize plotData based on the fetched signals
        console.log(data)
        const initPlotData = data.measurement.signals.map((s) => ({
          name: s.name,
          x: [],
          y: [],
        })).concat(data.forecast.signals.map((s) => ({
          name: s.name,
          x: [],
          y: [],
        })));
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
      if (selectedSignals) {
        const updatedSignalData = await fetchSignalData(selectedSignals);
        setPlotData(updatedSignalData);
      }
    };

    let updateIntervalMs = parseInt(updateInterval, 10);
    if (isNaN(updateIntervalMs) || updateIntervalMs < 1000) updateIntervalMs = 5000;
    const intervalId = setInterval(updateAllSignalData, updateIntervalMs);

    return () => clearInterval(intervalId);
  }, [selectedSignals, updateInterval]);

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
          const config = selectedSignals?.measurement.signals.find((signal) => signal.name === data.name) ||
            selectedSignals?.forecast.signals.find((signal) => signal.name === data.name);
          return {
            ...data,
            lineStyle: config?.lineStyleConfig.lineStyle,
            lineWidth: config?.lineStyleConfig.lineWidth,
            color: config?.lineStyleConfig.color,
          };
        })}
        yAxisLabel="Value"
      />
    </VStack>
  );
};

export default TimeSeriesPlotWithStates;