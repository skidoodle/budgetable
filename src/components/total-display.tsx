import NumberFlow from "@number-flow/react";

interface TotalDisplayProps {
	total: number;
}

const TotalDisplay = ({ total }: TotalDisplayProps) => (
	<div className="mx-2 text-left font-bold text-lg">
		Total: <NumberFlow value={total} />
	</div>
);

export default TotalDisplay;
