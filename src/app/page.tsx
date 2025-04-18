import {
  Box,
  ClientOnly,
  HStack,
  Skeleton,
} from "@chakra-ui/react";
import { ColorModeToggle } from "../components/ui/color-mode-toggle";
import VariableSelection from "../components/VariableSelection";
import ParentVariableSelection from "@/components/ParentVariableSelection";

export default async function Page() {
  return (
    <>
    <HStack align="start" gap={0}>
      <ParentVariableSelection />
      <Box flex="1" p={4}>
        {/* Main content goes here */}
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