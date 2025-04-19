"use client";

import { createListCollection, Portal, Select } from "@chakra-ui/react";
import { VariableInfo } from "@/lib/fetchBoptest";

interface SignalSelectorProps {
  measurementVariables: VariableInfo[];
  forecastVariables: VariableInfo[];
  onSelectSignal: (selectedSignals: string[]) => void;
}

const SignalSelector = ({
  measurementVariables,
  forecastVariables,
  onSelectSignal,
}: SignalSelectorProps) => {
  const allVariableNames = [...measurementVariables, ...forecastVariables].map(
    (variable) => variable.name
  );

  const allVariables = createListCollection({
    items: allVariableNames.map((name) => ({ label: name, value: name })),
  });

  return (
    <Select.Root
      multiple
      collection={allVariables}
      onValueChange={(e) => onSelectSignal(e.value)}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select a signal" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
      <Select.Positioner>
        <Select.Content>
          <Select.ItemGroup key="measurementVariables">
            <Select.ItemGroupLabel>Measurement Variables</Select.ItemGroupLabel>
            {measurementVariables.map((variable) => (
              <Select.Item key={variable.name} item={variable.name}>
                {variable.name}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.ItemGroup>
          <Select.ItemGroup key="forecastVariables">
            <Select.ItemGroupLabel>Forecast Variables</Select.ItemGroupLabel>
            {forecastVariables.map((variable) => (
              <Select.Item key={variable.name} item={variable.name}>
                {variable.name}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.ItemGroup>
        </Select.Content>
      </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default SignalSelector;