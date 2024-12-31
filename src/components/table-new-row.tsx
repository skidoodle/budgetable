import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Budgetable } from "@/lib/utils";

interface TNewRowProps {
	newRow: Budgetable;
	setNewRow: React.Dispatch<React.SetStateAction<Budgetable>>;
	handleAddRow: () => Promise<void>;
}

const TNewRow: React.FC<TNewRowProps> = ({
	newRow,
	setNewRow,
	handleAddRow,
}) => (
	<TableRow>
		<TableCell>
			<Input
				placeholder="New title"
				value={newRow.title}
				onChange={(e) => setNewRow({ ...newRow, title: e.target.value })}
			/>
		</TableCell>
		<TableCell>
			<Input
				type="number"
				placeholder="New price"
				value={newRow.price || ""}
				onChange={(e) =>
					setNewRow({
						...newRow,
						price: Number.parseFloat(e.target.value) || 0,
					})
				}
			/>
		</TableCell>
		<TableCell>
			<Input
				placeholder="New link"
				value={newRow.link}
				onChange={(e) => setNewRow({ ...newRow, link: e.target.value })}
			/>
		</TableCell>
		<TableCell>
			<Input
				placeholder="New note"
				value={newRow.note || ""}
				onChange={(e) => setNewRow({ ...newRow, note: e.target.value })}
			/>
		</TableCell>
		<TableCell />
		<TableCell>
			<Button onClick={handleAddRow}>Add</Button>
		</TableCell>
	</TableRow>
);

export default TNewRow;
