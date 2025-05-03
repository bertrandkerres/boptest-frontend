"use client";

import { useEffect, useState } from "react";
import { Box, Spinner, Table } from "@chakra-ui/react";
import { getNameByTestid, getStepByTestid, getScenarioByTestid } from "@/client/sdk.gen";

const BoptestMeta = ({ serverUrl, testId }: { serverUrl: string, testId: string }) => {
  const [testCaseName, setTestCaseName] = useState<string | null>(null);
  const [timeStep, setTimeStep] = useState<number | null>(null);
  const [scenario, setScenario] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const nameResponse = await getNameByTestid({
          baseUrl: serverUrl,
          path: {testid: testId}
        });
        const stepResponse = await getStepByTestid({
          baseUrl: serverUrl,
          path: {testid: testId}
        });
        const scenarioResponse = await getScenarioByTestid({
          baseUrl: serverUrl,
          path: {testid: testId}
        });

        if (nameResponse.data?.payload?.name) {
          setTestCaseName(nameResponse.data.payload.name);
        }

        if (stepResponse.data?.payload) {
          setTimeStep(stepResponse.data.payload);
        }

        if (scenarioResponse.data?.payload) {
          setScenario(scenarioResponse.data.payload);
        }
      } catch (error) {
        console.error("Error fetching test case metadata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [serverUrl, testId]);

  if (loading) {
    return (
      <Box textAlign="center" p={4}>
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Table.Root variant="line" size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Property</Table.ColumnHeader>
            <Table.ColumnHeader>Value</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Server URL</Table.Cell>
            <Table.Cell>{serverUrl}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Test Case Name</Table.Cell>
            <Table.Cell>{testCaseName || "N/A"}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Time Step</Table.Cell>
            <Table.Cell>{timeStep !== null ? `${timeStep} seconds` : "N/A"}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Scenario</Table.Cell>
            <Table.Cell>
              {scenario
                ? Object.entries(scenario)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join("\n")
                : "N/A"}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default BoptestMeta;