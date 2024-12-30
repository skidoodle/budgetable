import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
	status: "Paid" | "Unpaid";
	toggleStatus: () => void;
}

const StatusBadge = ({ status, toggleStatus }: StatusBadgeProps) => (
	<Badge
		variant={status === "Paid" ? "paid" : "unpaid"}
		className="cursor-pointer"
		onClick={toggleStatus}
	>
		{status}
	</Badge>
);

export default StatusBadge;
