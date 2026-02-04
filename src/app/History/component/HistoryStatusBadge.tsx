import { Badge, getBadgeVariant } from "@/components/ui/Badge";

export default function HistoryStatusBadge({ status }: Readonly<{ status: string }>) {
    return (
        <Badge variant={getBadgeVariant(status)}>
            {status || 'Unknown'}
        </Badge>
    );
}