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

const initSignals: SignalConfig[] = [
  {name: "LowerSetp[1]", lineStyle: "dot", lineWidth: 1, color: "black"},
  {name: "UpperSetp[1]", lineStyle: "dot", lineWidth: 1, color: "black"},
  {name: "reaTZon_y", lineStyle: "solid", lineWidth: 1, color: "black"},
  {name: "reaTSup_y", lineStyle: "solid", lineWidth: 1, color: "red"},
]

interface TimeSeriesPlotWithStatesProps {
  fetchSignalData: (signalNames: string[]) => Promise<Array<{ name: string; x: number[]; y: number[] }>>;
}

const TimeSeriesPlotWithStates = ({
  fetchSignalData,
}: TimeSeriesPlotWithStatesProps) => {

  const selectedSignals = initSignals;
  const initPlotData = initSignals.map((s) => ({
    name: s.name,
    x: [],
    y: [],
  }));
  const [plotData, setPlotData] = useState<Array<{ name: string; x: number[]; y: number[] }>>(initPlotData);
  const [updateInterval, setUpdateInterval] = useState<string>("5000");


  const handleUpdateIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateInterval(event.target.value);
  };

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