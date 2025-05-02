"use client";

import { VStack } from "@chakra-ui/react";
import VariableDescriptionList from "./VariableDescriptionList";
import BoptestMeta from "./BoptestMeta";
import { VariableInfo } from "@/lib/fetchBoptest";

interface TestcaseMetaProps {
  measurementVariables: VariableInfo[];
  forecastVariables: VariableInfo[];
  serverUrl: string;
  testId: string;
}

const TestcaseMeta = ({
  measurementVariables,
  forecastVariables,
  serverUrl,
  testId,
}: TestcaseMetaProps) => {
  return (
    <VStack align="start">
      <BoptestMeta serverUrl={serverUrl} testId={testId}/>
      <VariableDescriptionList title="Measurement Variables" variables={measurementVariables} />
      <VariableDescriptionList title="Forecast Variables" variables={forecastVariables} />
    </VStack>
  );
};

export default TestcaseMeta;