import { Sparkles, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Insight } from "@/types";

export function AiInsightsCard({
  insights,
  title = "Smart Insights",
  actionLabel = "View Full Analysis",
}: {
  insights: Insight[];
  title?: string;
  actionLabel?: string;
}) {
  return (
    <Card variant="highlight" className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex w-full items-start gap-3 rounded-xl border border-border/50 bg-card/50 p-4 text-left transition-colors hover:bg-muted/50"
          >
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
        <Button className="w-full" variant="outline">
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
