
'use client';

import { Card, Title, BarList, Flex, Text } from "@tremor/react";

interface StorageChartProps {
  data: {
    name: string;
    value: number;
    href?: string;
    icon?: any;
  }[];
}

const valueFormatter = (number: number) => {
  if (number > 1000000000) return `${(number / 1000000000).toFixed(2)} GB`;
  if (number > 1000000) return `${(number / 1000000).toFixed(2)} MB`;
  if (number > 1000) return `${(number / 1000).toFixed(2)} KB`;
  return `${number} B`;
};

export default function StorageChart({ data }: StorageChartProps) {
  return (
    <Card className="card-indie ring-0 bg-zinc-900 border-zinc-800">
      <Title className="text-zinc-100 font-bold mb-4 flex items-center gap-2">
        <span className="text-pink-500">◆</span> Project Storage
      </Title>
      <Flex className="mt-4 border-b border-zinc-800 pb-2">
        <Text className="text-zinc-500 font-medium">Source</Text>
        <Text className="text-zinc-500 font-medium">Size</Text>
      </Flex>
      <div className="mt-4">
        <BarList 
          data={data} 
          className="mt-2" 
          valueFormatter={valueFormatter} 
          color="pink"
        />
      </div>
    </Card>
  );
}
