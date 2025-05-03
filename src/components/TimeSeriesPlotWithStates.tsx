"use client";

import { useEffect, useState } from "react";
import { VStack } from "@chakra-ui/react";
import TimeSeriesPlot from "@/components/TimeSeriesPlot";
import { PlotConfig } from "@/app/[serverUrl]/[testid]/page";

export interface TimeSeriesPlotWithStatesProps {
  selectedSignals: PlotConfig | null;
  updateInterval: string; // Update frequency passed as a prop
  fetchSignalData: (plotConfig: PlotConfig) => Promise<Array<{ name: string; x: number[]; y: number[] }>>;
}

const TimeSeriesPlotWithStates = ({
  selectedSignals,
  updateInterval,
  fetchSignalData,
}: TimeSeriesPlotWithStatesProps) => {
  if (selectedSignals === null) return (<></>);

  const [plotData, setPlotData] = useState<Array<{ name: string; x: number[]; y: number[] }>>([]);

  // Fetch initial signals from JSON file
  useEffect(() => {
    const fetchInitialSignals = async () => {
      try {

        // Initialize plotData based on the fetched signals
        const initPlotData = selectedSignals.measurement.signals.map((s) => ({
          name: s.name,
          x: [],
          y: [],
        })).concat(selectedSignals.forecast.signals.map((s) => ({
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

  useEffect(() => {
    const updateAllSignalData = async () => {
      if (selectedSignals) {
        const updatedSignalData = await fetchSignalData(selectedSignals);
        setPlotData(updatedSignalData);
      }
    };
    const intervalId = setInterval(updateAllSignalData, parseInt(updateInterval, 10));

    return () => clearInterval(intervalId);
  }, [selectedSignals, updateInterval]);

  return (
    <VStack width="100%">
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