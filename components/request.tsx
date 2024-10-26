"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { AnimatePresence, motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card, CardContent, CardHeader } from "./ui/card";

export interface RequestProps {
  timestamp: string;
  headers: string;
  body: string;
  type: "get" | "post" | "put" | "patch" | "delete";
}

export function Request({ timestamp, headers, body, type }: RequestProps) {
  const headerObj: Record<string, string> | null = headers
    ? JSON.parse(headers)
    : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="w-full h-full bg-muted/25">
          <CardHeader className="flex flex-row gap-2 items-center justify-between mb-4 p-2">
            <div className="flex flex-row gap-2 items-center">
              <Badge variant={type} className="uppercase">
                {type}
              </Badge>
              <p className="text-muted-foreground text-xs font-semibold">
                {timestamp}
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <div className="mb-4">
              <h4 className="font-semibold text-foreground text-sm mb-2 ml-2">
                Headers
              </h4>
              <div className="rounded-xl border border-dashed overflow-x-auto bg-background">
                {headerObj && Object.keys(headerObj).length > 0 && (
                  <Table>
                    <TableBody>
                      {Object.entries(headerObj).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="text-xs whitespace-nowrap">
                            {key}
                          </TableCell>
                          <TableCell className="text-xs">{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {(headerObj == null || Object.keys(headerObj).length === 0) && (
                  <p className="p-4 text-muted-foreground font-bold text-xs">
                    No header values found.
                  </p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2 ml-2">
                Body
              </h4>
              <div className="p-4 rounded-xl border border-dashed bg-background code">
                {body ? (
                  <SyntaxHighlighter
                    language="js"
                    style={coy}
                    showLineNumbers={true}
                  >
                    {JSON.stringify(JSON.parse(body), null, 2)}
                  </SyntaxHighlighter>
                ) : (
                  <p className="text-muted-foreground font-bold text-xs">
                    No body data found.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
