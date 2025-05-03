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
    lineStyle?: "solid" | "dot" | "dash"; // Line style
    lineWidth?: number; // Line width
    color?: string; // Line color
  }>;
  yAxisLabel: string; // Label for the y-axis
}

const TimeSeriesPlot = (
  { title, data, yAxisLabel }: TimeSeriesPlotProps,
  width: number = 800,
  height: number = 480,      
) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this component only renders on the client
  }, []);

  if (!isClient) return null;

  console.log("Drawing plot ", title)
  return (
    <Plot
      data={data.map((series) => ({
        x: series.x,
        y: series.y,
        type: "scatter",
        mode: "lines",
        name: series.name,
        line: {
          dash: series.lineStyle || "solid", // Default to solid line
          width: series.lineWidth || 2, // Default line width
          color: series.color || undefined, // Default to Plotly's automatic color
        },
      }))}
      layout={{
        title: { text: title },
        xaxis: { title: { text: "Time" } },
        yaxis: { title: { text: yAxisLabel } },
        margin: { l: 50, r: 30, t: 50, b: 50 },
        showlegend: true,
        legend: {
          x: 1,
          xanchor: "right",
          y: 1
        },
        width: width,
        height: height
      }}
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true }}
    />
  );
};

export default TimeSeriesPlot;