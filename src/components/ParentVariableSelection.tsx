"use client";
import { useEffect, useState } from "react";
import { VStack } from "@chakra-ui/react";
import VariableSelection from "./VariableSelection";
import { fetchForecastVariables, fetchMeasurementVariables } from "@/lib/fetchBoptest";

const ParentVariableSelection = () => {
  const [measurementVariables, setMeasurementVariables] = useState<string[]>([]);
  const [forecastVariables, setForecastVariables] = useState<string[]>([]);

  useEffect(() => {
    const fetchVariables = async () => {
      const measurement_vars = await fetchMeasurementVariables();
      setMeasurementVariables(measurement_vars);

      const forecast_names = await fetchForecastVariables();
      setForecastVariables(forecast_names);
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