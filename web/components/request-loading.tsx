import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RequestLoading() {
  return (
    <Card className="h-full w-full bg-muted/25">
      <CardHeader className="mb-4 flex flex-row items-center justify-between gap-2 p-2">
        <div className="flex flex-row items-center gap-2">
          <Badge variant="post" className="uppercase">
            POST
          </Badge>
          <p className="text-xs font-semibold text-muted-foreground">
            <Skeleton className="h-4 w-36" />
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <h4 className="mb-2 ml-2 text-sm font-semibold text-foreground">
            Headers
          </h4>
          <Skeleton className="h-32 w-full" />
        </div>
        <div>
          <h4 className="mb-2 ml-2 text-sm font-semibold text-foreground">
            Body
          </h4>
          <Skeleton className="h-32 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
