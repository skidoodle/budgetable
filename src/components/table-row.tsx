import { Input } from "@/components/ui/input";
import { TableRow, TableCell } from "@/components/ui/table";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
import DeleteDialog from "@/components/delete-dialog";

interface Budgetable {
	id: string;
	title: string;
	price: number;
	link: string;
	note?: string;
	status: "Paid" | "Unpaid";
}

interface TRowProps {
	row: Budgetable;
	isEditing: boolean;
	setData: React.Dispatch<React.SetStateAction<Budgetable[]>>;
	recentlyUpdatedRowId: string | null;
	handleSave: (
		updatedRow: Budgetable,
		originalRow: Budgetable,
	) => Promise<void>;
	handleDeleteRow: (id: string) => Promise<void>;
	toggleStatus: (row: Budgetable) => Promise<void>;
}

const TRow: React.FC<TRowProps> = ({
	row,
	isEditing,
	setData,
	recentlyUpdatedRowId,
	handleSave,
	handleDeleteRow,
	toggleStatus,
}) => (
	<TableRow
		className={`transition-opacity ${
			recentlyUpdatedRowId === row.id ? "blur-sm opacity-50" : ""
		}`}
	>
		<TableCell>
			{isEditing ? (
				<Input
					value={row.title}
					onChange={(e) =>
						setData((prev) =>
							prev.map((item) =>
								item.id === row.id ? { ...item, title: e.target.value } : item,
							),
						)
					}
					onBlur={() => handleSave(row, { ...row })}
				/>
			) : (
				<span>{row.title}</span>
			)}
		</TableCell>
		<TableCell>
			{isEditing ? (
				<Input
					type="number"
					value={row.price}
					onChange={(e) =>
						setData((prev) =>
							prev.map((item) =>
								item.id === row.id
									? { ...item, price: Number.parseFloat(e.target.value) || 0 }
									: item,
							),
						)
					}
					onBlur={() => handleSave(row, { ...row })}
				/>
			) : (
				<span>{row.price.toLocaleString()} HUF</span>
			)}
		</TableCell>
		<TableCell>
			{isEditing ? (
				<Input
					value={row.link}
					onChange={(e) =>
						setData((prev) =>
							prev.map((item) =>
								item.id === row.id ? { ...item, link: e.target.value } : item,
							),
						)
					}
					onBlur={() => handleSave(row, { ...row })}
				/>
			) : row.link ? (
				<Link
					href={row.link}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-500 underline"
				>
					Visit
				</Link>
			) : (
				<span className="text-gray-400 italic">No link</span>
			)}
		</TableCell>
		<TableCell>
			{isEditing ? (
				<Input
					value={row.note || ""}
					onChange={(e) =>
						setData((prev) =>
							prev.map((item) =>
								item.id === row.id ? { ...item, note: e.target.value } : item,
							),
						)
					}
					onBlur={() => handleSave(row, { ...row })}
				/>
			) : (
				<span>{row.note || "-"}</span>
			)}
		</TableCell>
		<TableCell>
			<StatusBadge status={row.status} toggleStatus={() => toggleStatus(row)} />
		</TableCell>
		{isEditing && (
			<TableCell>
				<DeleteDialog onConfirm={() => handleDeleteRow(row.id)} />
			</TableCell>
		)}
	</TableRow>
);

export default TRow;
