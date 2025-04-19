"use client";

import { Box, VStack, Input, Button, Select, Heading, createListCollection, HStack, Portal } from "@chakra-ui/react";

export type SignalConfig = {
  name: string;
  lineStyle: "solid" | "dot" | "dash";
  lineWidth: number;
  color: string;
}

interface SignalPlotConfiguratorProps {
  selectedSignals: SignalConfig[];
  onUpdateSignal: (index: number, updatedConfig: Partial<SignalConfig>) => void;
}

const SignalPlotConfigurator = ({
  selectedSignals,
  onUpdateSignal,
}: SignalPlotConfiguratorProps) => {

  const linestyles = createListCollection({
    items: [
      { label: "-", value: "solid" },
      { label: "--", value: "dash" },
      { label: ":", value: "dot" },
    ],
  })

  return (
    <VStack align="start" width="100%" borderWidth="1px" borderRadius="md" p={2}>
      {selectedSignals.map((signal, index) => (
          <HStack align="center" key={signal.name} width="100%">
          <Heading size="xs" width="40%">{signal.name}</Heading>
            <Select.Root
              value={[signal.lineStyle]}
              collection={linestyles}
              onValueChange={(e) =>
                onUpdateSignal(index, { lineStyle: e.value[0] as SignalConfig["lineStyle"] })
              }
              size="xs"
              width="20%"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select line style" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {linestyles.items.map((s) => (
                      <Select.Item item={s} key={s.value}>{s.label}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            <Input
              type="number"
              value={signal.lineWidth}
              onChange={(e) => onUpdateSignal(index, { lineWidth: parseInt(e.target.value, 10) })}
              placeholder="Line Width"
              size="xs"
              width="20%"
            />
            <Input
              type="color"
              value={signal.color}
              onChange={(e) => onUpdateSignal(index, { color: e.target.value })}
              size="xs"
              width="20%"
            />
          </HStack>
      ))}
    </VStack>
  );
};

export default SignalPlotConfigurator;