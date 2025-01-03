import { Input } from "@/components/ui/input";
import { TableRow, TableCell } from "@/components/ui/table";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
import DeleteDialog from "@/components/delete-dialog";
import { useState } from "react";
import type { Budgetable } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

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

const TRow = ({
	row,
	isEditing,
	setData,
	recentlyUpdatedRowId,
	handleSave,
	handleDeleteRow,
	toggleStatus,
}: TRowProps) => {
	const [originalRow, setOriginalRow] = useState<Budgetable>(row);

	const handleInputFocus = () => {
		setOriginalRow({ ...row });
	};

	return (
		<TableRow
			className={`transition-opacity ${
				recentlyUpdatedRowId === row.id ? "blur-sm opacity-50" : ""
			}`}
		>
			<TableCell>
				{isEditing ? (
					<Input
						value={row.title}
						onFocus={handleInputFocus}
						onChange={(e) =>
							setData((prev) =>
								prev.map((item) =>
									item.id === row.id
										? { ...item, title: e.target.value }
										: item,
								),
							)
						}
						onBlur={() => handleSave(row, originalRow)}
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
						onFocus={handleInputFocus}
						onChange={(e) =>
							setData((prev) =>
								prev.map((item) =>
									item.id === row.id
										? { ...item, price: Number.parseFloat(e.target.value) || 0 }
										: item,
								),
							)
						}
						onBlur={() => handleSave(row, originalRow)}
					/>
				) : (
					<span>{row.price.toLocaleString()}</span>
				)}
			</TableCell>
			<TableCell>
				{isEditing ? (
					<Input
						value={row.link}
						onFocus={handleInputFocus}
						onChange={(e) =>
							setData((prev) =>
								prev.map((item) =>
									item.id === row.id ? { ...item, link: e.target.value } : item,
								),
							)
						}
						onBlur={() => handleSave(row, originalRow)}
					/>
				) : row.link ? (
					<TooltipProvider delayDuration={150}>
						<Tooltip>
							<TooltipTrigger className="text-blue-500 underline">
								<Link href={row.link} target="_blank" rel="noopener noreferrer">
									Visit
								</Link>
							</TooltipTrigger>
							<TooltipContent className="text-white bg-black">
								{row.link.replace(/^https?:\/\//, "")}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				) : (
					<span className="text-gray-400 italic">No link</span>
				)}
			</TableCell>
			<TableCell>
				{isEditing ? (
					<Input
						value={row.note || ""}
						onFocus={handleInputFocus}
						onChange={(e) =>
							setData((prev) =>
								prev.map((item) =>
									item.id === row.id ? { ...item, note: e.target.value } : item,
								),
							)
						}
						onBlur={() => handleSave(row, originalRow)}
					/>
				) : (
					<span>{row.note || "-"}</span>
				)}
			</TableCell>
			<TableCell>
				<StatusBadge
					status={row.status}
					toggleStatus={() => toggleStatus(row)}
				/>
			</TableCell>
			{isEditing && (
				<TableCell>
					<DeleteDialog onConfirm={() => handleDeleteRow(row.id)} />
				</TableCell>
			)}
		</TableRow>
	);
};

export default TRow;
