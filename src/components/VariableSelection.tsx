"use client";
import { Box, Checkbox, VStack, Heading } from "@chakra-ui/react";

interface VariableSelectionProps {
  title: string;
  variables: string[];
}

const VariableSelection = ({ title, variables }: VariableSelectionProps) => {
  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        {title}
      </Heading>
      <VStack align="start" gap={2}>
        {variables.map((variable) => (
            <Checkbox.Root key={variable}>
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Label>
                {variable}
              </Checkbox.Label>
              </Checkbox.Root>
        ))}
      </VStack>
    </Box>
  );
};

export default VariableSelection;