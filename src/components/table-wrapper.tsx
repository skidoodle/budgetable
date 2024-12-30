import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import TRow from "@/components/table-row";
import TNewRow from "@/components/table-new-row";

interface Budgetable {
	id: string;
	title: string;
	price: number;
	link: string;
	note?: string;
	status: "Paid" | "Unpaid";
}

interface TWrapperProps {
	data: Budgetable[];
	isEditing: boolean;
	setData: React.Dispatch<React.SetStateAction<Budgetable[]>>;
	newRow: Budgetable;
	setNewRow: React.Dispatch<React.SetStateAction<Budgetable>>;
	recentlyUpdatedRowId: string | null;
	handleSave: (
		updatedRow: Budgetable,
		originalRow: Budgetable,
	) => Promise<void>;
	handleAddRow: () => Promise<void>;
	handleDeleteRow: (id: string) => Promise<void>;
	toggleStatus: (row: Budgetable) => Promise<void>;
}

const TWrapper: React.FC<TWrapperProps> = ({
	data,
	isEditing,
	setData,
	newRow,
	setNewRow,
	recentlyUpdatedRowId,
	handleSave,
	handleAddRow,
	handleDeleteRow,
	toggleStatus,
}) => (
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Title</TableHead>
				<TableHead>Price</TableHead>
				<TableHead>Link</TableHead>
				<TableHead>Note</TableHead>
				<TableHead>Status</TableHead>
				{isEditing && <TableHead>Actions</TableHead>}
			</TableRow>
		</TableHeader>
		<TableBody>
			{data.map((row) => (
				<TRow
					key={row.id}
					row={row}
					isEditing={isEditing}
					setData={setData}
					recentlyUpdatedRowId={recentlyUpdatedRowId}
					handleSave={handleSave}
					handleDeleteRow={handleDeleteRow}
					toggleStatus={toggleStatus}
				/>
			))}
			{isEditing && (
				<TNewRow
					newRow={newRow}
					setNewRow={setNewRow}
					handleAddRow={handleAddRow}
				/>
			)}
		</TableBody>
	</Table>
);

export default TWrapper;