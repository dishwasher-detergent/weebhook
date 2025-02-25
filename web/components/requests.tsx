"use client";

import { useMemo } from "react";

import { ChartData, RequestsChart } from "@/components/requests-chart";
import { Request as RequestInterface } from "@/interfaces/request.interface";
import { Request } from "@/components/request";
import { NoRequests } from "@/components/no-requests";
import { useRequests } from "@/hooks/useRequests";
import { useParams } from "next/navigation";

interface RequestsProps {
  requests: RequestInterface[];
}

export default function Requests({ requests: initialRequests }: RequestsProps) {
  const { project } = useParams<{
    project: string;
  }>();

  const { requests, loading } = useRequests({
    projectId: project,
    initalRequests: initialRequests,
  });

  const requestsChartData = useMemo(() => {
    const requestCountByHour: any = {};

    requests.forEach((item) => {
      const date = item.$createdAt.split(":")[0];
      if (requestCountByHour[date]) {
        requestCountByHour[date]++;
      } else {
        requestCountByHour[date] = 1;
      }
    });

    return Object.entries(requestCountByHour).map(([date, requests]) => ({
      date,
      requests,
    })) as ChartData[];
  }, [requests]);

  return (
    <>
      <RequestsChart data={requestsChartData} />
      <div className="flex flex-col gap-4">
        {requests.map((item) => (
          <Request
            key={item.$id}
            timestamp={item.$createdAt}
            body={item.body}
            headers={item.headers}
            type={item.type}
          />
        ))}
        {requests.length === 0 && <NoRequests />}
      </div>
    </>
  );
}
