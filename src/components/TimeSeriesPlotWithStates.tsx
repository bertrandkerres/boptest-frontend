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

  const initPlotData = (selectedSignals === null) ? [] : (
    selectedSignals.measurement.signals.map((s) => ({
      name: s.name,
      x: [],
      y: [],
    })).concat(selectedSignals.forecast.signals.map((s) => ({
      name: s.name,
      x: [],
      y: [],
    })))
  );

  const [plotData, setPlotData] = useState<Array<{ name: string; x: number[]; y: number[] }>>(initPlotData);

  useEffect(() => {
    const updateAllSignalData = async () => {
      if (selectedSignals) {
        const updatedSignalData = await fetchSignalData(selectedSignals);
        setPlotData(updatedSignalData);
      }
    };
    const intervalId = setInterval(updateAllSignalData, parseInt(updateInterval, 10));

    return () => clearInterval(intervalId);
  }, [selectedSignals, fetchSignalData, updateInterval]);

  return (selectedSignals === null) ? (<></>) : (
    <VStack width="100%">
      <TimeSeriesPlot
        title={selectedSignals.title}
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
        yAxisLabel={selectedSignals.yLabel}
      />
    </VStack>
  );
};

export default TimeSeriesPlotWithStates;