interface TotalDisplayProps {
	total: number;
}

const TotalDisplay: React.FC<TotalDisplayProps> = ({ total }) => (
	<div className="mt-4 text-right font-bold text-lg">
		Total: {total.toLocaleString()}
		<p className="text-xs ml-1">
			({Math.round(total * 1.27).toLocaleString()})
		</p>
	</div>
);

export default TotalDisplay;
