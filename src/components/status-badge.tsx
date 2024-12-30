import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
	status: "Paid" | "Unpaid";
	toggleStatus: () => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, toggleStatus }) => (
	<Badge
		variant={status === "Paid" ? "destructive" : "secondary"}
		className="cursor-pointer"
		onClick={toggleStatus}
	>
		{status}
	</Badge>
);

export default StatusBadge;
