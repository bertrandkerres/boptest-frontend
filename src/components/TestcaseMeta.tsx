"use client";

import { VStack } from "@chakra-ui/react";
import VariableDescriptionList from "./VariableDescriptionList";
import BoptestMeta from "./BoptestMeta";
import { VariableInfo } from "@/lib/fetchBoptest";

interface TestcaseMetaProps {
  measurementVariables: VariableInfo[];
  forecastVariables: VariableInfo[];
  serverUrl: string;
}

const TestcaseMeta = ({
  measurementVariables,
  forecastVariables,
  serverUrl,
}: TestcaseMetaProps) => {
  return (
    <VStack align="start">
      <BoptestMeta serverUrl={serverUrl} />
      <VariableDescriptionList title="Measurement Variables" variables={measurementVariables} />
      <VariableDescriptionList title="Forecast Variables" variables={forecastVariables} />
    </VStack>
  );
};

export default TestcaseMeta;