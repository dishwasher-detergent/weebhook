"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { AnimatePresence, motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface RequestProps {
  timestamp: string;
  headers: string;
  body: string;
}

export function Request({ timestamp, headers, body }: RequestProps) {
  const headerObj: Record<string, string> = JSON.parse(headers);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        className="p-2 rounded-xl border border-dashed bg-muted/50 space-y-4"
      >
        <header className="flex flex-row gap-2 items-center justify-between cursor-pointer">
          <div className="flex flex-row gap-2 items-center">
            <Badge variant="default">POST</Badge>
            <p className="text-muted-foreground text-sm font-semibold">
              {timestamp}
            </p>
          </div>
        </header>

        <div>
          <h4 className="font-semibold text-primary-foreground text-base mb-1 ml-2">
            Headers
          </h4>
          <div className="rounded-xl border border-dashed overflow-x-auto bg-background">
            {Object.keys(headerObj).length > 0 && (
              <Table>
                <TableBody>
                  {Object.entries(headerObj).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {Object.keys(headerObj).length === 0 && (
              <div className="p-4 text-muted-foreground font-bold text-sm">
                No header values found.
              </div>
            )}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground text-base mb-1 ml-2">
            Body
          </h4>
          <div className="p-4 rounded-xl border border-dashed bg-background code">
            <SyntaxHighlighter language="js" style={coy} showLineNumbers={true}>
              {JSON.stringify(JSON.parse(body), null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
