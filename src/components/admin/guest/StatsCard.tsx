
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  className?: string;
}

export default function StatsCard({ title, value, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
}
