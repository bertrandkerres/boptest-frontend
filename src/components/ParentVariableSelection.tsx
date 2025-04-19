"use client";
import { useEffect, useState } from "react";
import { VStack } from "@chakra-ui/react";
import VariableSelection from "./VariableSelection";
import { fetchForecastVariables, fetchMeasurementVariables, VariableInfo } from "@/lib/fetchBoptest";

const ParentVariableSelection = () => {
  const [measurementVariables, setMeasurementVariables] = useState<VariableInfo[]>([]);
  const [forecastVariables, setForecastVariables] = useState<VariableInfo[]>([]);

  useEffect(() => {
    const fetchVariables = async () => {
      const measurementVars = await fetchMeasurementVariables();
      setMeasurementVariables(measurementVars);

      const forecastVars = await fetchForecastVariables();
      setForecastVariables(forecastVars);
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