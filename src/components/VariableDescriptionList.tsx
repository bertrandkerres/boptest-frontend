"use client";
import { Box, VStack, Heading, Text } from "@chakra-ui/react";
import { Collapsible } from "@chakra-ui/react";
import { VariableInfo } from "@/lib/fetchBoptest";

interface VariableDescriptionListProps {
  title: string;
  variables: VariableInfo[];
}

const VariableDescriptionList = ({ title, variables }: VariableDescriptionListProps) => {
  return (
    <Box p={4}>
      <Heading size="sm" mb={4}>
        {title}
      </Heading>
      <VStack align="start" gap={2}>
        {variables.map((variable) => (
          <Collapsible.Root key={variable.name}>
            <Collapsible.Trigger fontSize="sm">
                {variable.name} {variable.unit && `[${variable.unit}]`}
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Text mt={2} fontSize="sm" color="gray.600">
                {variable.description}
              </Text>
            </Collapsible.Content>
          </Collapsible.Root>
        ))}
      </VStack>
    </Box>
  );
};

export default VariableDescriptionList;