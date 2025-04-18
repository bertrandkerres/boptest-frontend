"use client";
import { useEffect, useState } from "react";
import { VStack } from "@chakra-ui/react";
import VariableSelection from "./VariableSelection";
import { getMeasurements, getInputs, getForecastPoints } from "../client/sdk.gen";

const ParentVariableSelection = () => {
  const [measurementVariables, setMeasurementVariables] = useState<string[]>([]);
  const [forecastVariables, setForecastVariables] = useState<string[]>([]);

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        // Fetch measurement variables
        const measurements = await getMeasurements();
        const inputs = await getInputs();

        const measurementNames = Object.keys(measurements.data?.payload || {});
        const inputNames = Object.keys(inputs.data?.payload || {}).filter(
          (name) => !name.endsWith("_activate")
        );

        setMeasurementVariables([...measurementNames, ...inputNames]);

        // Fetch forecast variables
        const forecastPoints = await getForecastPoints();
        const forecastPointNames = Object.keys(forecastPoints.data?.payload || {});
        setForecastVariables(forecastPointNames);
      } catch (error) {
        console.error("Error fetching variables:", error);
      }
    };

    fetchVariables();
  }, []);

  return (
    <VStack align="start" gap={4}>
      <VariableSelection title="Measurement Variables" variables={measurementVariables} />
      <VariableSelection title="Forecast Variables" variables={forecastVariables} />
    </VStack>
  );
};

export default ParentVariableSelection;