import {
  Box,
  ClientOnly,
  HStack,
  Skeleton,
} from "@chakra-ui/react";
import { ColorModeToggle } from "../components/ui/color-mode-toggle";
import ParentVariableSelection from "@/components/ParentVariableSelection";
import TimeSeriesPlot from "@/components/TimeSeriesPlot";

export default async function Page() {
  // Example time series data
  const exampleData = [
    {
      name: "Temperature",
      x: [0, 1, 2, 3, 4], // Time values
      y: [20, 21, 19, 22, 30], // Temperature values
    },
    {
      name: "Humidity",
      x: [0, 1, 2, 3, 4], // Time values
      y: [50, 55, 53, 52, 54], // Humidity values
    },
  ];

  return (
    <>
      <HStack align="start" gap={0}>
        <ParentVariableSelection />
        <Box flex="1" p={4}>
          <TimeSeriesPlot
            title="Example Time Series"
            data={exampleData}
            yAxisLabel="Value"
          />
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