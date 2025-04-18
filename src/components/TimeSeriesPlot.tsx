"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface TimeSeriesPlotProps {
  title: string;
  data: Array<{
    name: string; // Name of the time series
    x: number[]; // Time values
    y: number[]; // Data values
  }>;
  yAxisLabel: string; // Label for the y-axis
}

const TimeSeriesPlot = ({ title, data, yAxisLabel }: TimeSeriesPlotProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this component only renders on the client
  }, []);

  if (!isClient) return null;

  return (
    <Plot
      data={data.map((series) => ({
        x: series.x,
        y: series.y,
        type: "scatter",
        mode: "lines",
        name: series.name,
      }))}
      layout={{
        title: title,
        xaxis: { title: {text: "Time"} },
        yaxis: { title: {text: yAxisLabel} },
        margin: { l: 50, r: 30, t: 50, b: 50 },
        showlegend: true,
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true }}
    />
  );
};

export default TimeSeriesPlot;