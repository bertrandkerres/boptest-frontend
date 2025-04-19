"use client";

import {
  Box,
  ClientOnly,
  HStack,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ParentVariableSelection from "@/components/ParentVariableSelection";
import TimeSeriesPlot from "@/components/TimeSeriesPlot";
import { ColorModeToggle } from "@/components/ui/color-mode-toggle";
import { fetchForecastData, TimeSeriesData } from "@/lib/fetchBoptest";
import TestCaseMetadata from "@/components/TestCaseMeta";


export default function Page() {
  const [forecastData, setForecastData] = useState<TimeSeriesData[]>([]);

  useEffect(() => {
    const loadForecastData = async () => {
      const data = await fetchForecastData(["LowerSetp[1]", "UpperSetp[1]"]);
      setForecastData(data);
    };

    loadForecastData();
  }, []);

  return (
    <>
      <HStack align="start" gap={0}>
        <VStack
          width="25%"
          borderRight="1px solid #e2e8f0"
          align="left"
          height="100vh" // Set the height to fill the viewport
          overflowY="auto" // Enable vertical scrolling
        >
          <TestCaseMetadata serverUrl="http://127.0.01:5000" />
          <ParentVariableSelection />
        </VStack>
        <Box flex="1" p={4}>
          {forecastData.length > 0 ? (
            <TimeSeriesPlot
              title="Forecast Time Series"
              data={forecastData}
              yAxisLabel="Value"
            />
          ) : (
            <Skeleton height="400px" />
          )}
        </Box>
      </HStack>
      <Box pos="absolute" top="4" right="4">
        <ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
          <ColorModeToggle />
        </ClientOnly>
      </Box>
    </>
  );
}