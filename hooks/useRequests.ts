import { Request as RequestItem } from "@/interfaces/request.interface";
import { createClient } from "@/lib/client/appwrite";
import { DATABASE_ID, REQUEST_COLLECTION_ID } from "@/lib/constants";

import { Client, Query } from "appwrite";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

interface Props {
  projectId: string;
  initalRequests?: RequestItem[];
}

export const useRequests = ({ projectId, initalRequests }: Props) => {
  const [requests, setRequests] = useState<RequestItem[]>(initalRequests ?? []);
  const [loading, setLoading] = useState<boolean>(true);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    async function fetchClient() {
      const { client } = await createClient();
      setClient(client);
    }

    fetchClient();
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (client) {
      unsubscribe = client.subscribe<RequestItem>(
        `databases.${DATABASE_ID}.collections.${REQUEST_COLLECTION_ID}.documents`,
        (response) => {
          if (response.payload.projectId === projectId) {
            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.create",
              )
            ) {
              setRequests((prev) => [response.payload, ...prev]);
            }

            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.delete",
              )
            ) {
              setRequests((prev) =>
                prev.filter((x) => x.$id !== response.payload.$id),
              );
            }
          }
        },
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [client, projectId]);

  return { requests, loading };
};
