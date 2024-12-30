"use client";

import { useState, useEffect } from "react";
import TableWrapper from "@/components/table-wrapper";
import Header from "@/components/header";
import TotalDisplay from "@/components/total-display";
import { toast } from "sonner";
interface Budgetable {
	id: string;
	title: string;
	price: number;
	link: string;
	note?: string;
	status: "Paid" | "Unpaid";
}

export default function App() {
	const [data, setData] = useState<Budgetable[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [newRow, setNewRow] = useState<Budgetable>({
		id: "",
		title: "",
		price: 0,
		link: "",
		note: "",
		status: "Unpaid",
	});
	const [recentlyUpdatedRowId, setRecentlyUpdatedRowId] = useState<
		string | null
	>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			try {
				const res = await fetch("/pocketbase");
				if (!res.ok) throw new Error("Failed to fetch data");
				const records: Budgetable[] = await res.json();
				setData(records);
			} catch (err) {
				toast.error("Error fetching data. Please try again later.");
				console.error("Error fetching data:", err);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	const handleSave = async (
		updatedRow: Budgetable,
		originalRow: Budgetable,
	) => {
		setLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 250));

			setData((prev) =>
				prev.map((item) => (item.id === originalRow.id ? updatedRow : item)),
			);
			setRecentlyUpdatedRowId(updatedRow.id);
			setTimeout(() => setRecentlyUpdatedRowId(null), 250);
			toast.success("Row saved successfully");
		} catch (err) {
			toast.error("Error saving row. Please try again.");
			console.error("Error saving row:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleAddRow = async () => {
		if (!newRow.title || newRow.price <= 0) return;

		setLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 250));

			setData((prev) => [...prev, { ...newRow, id: `${Date.now()}` }]);
			setNewRow({
				id: "",
				title: "",
				price: 0,
				link: "",
				note: "",
				status: "Unpaid",
			});
			toast.success("Row added successfully");
		} catch (err) {
			toast.error("Error adding row. Please try again.");
			console.error("Error adding row:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteRow = async (id: string) => {
		setLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 250));

			setData((prev) => prev.filter((item) => item.id !== id));
			toast.success("Row deleted successfully");
		} catch (err) {
			toast.error("Error deleting row. Please try again.");
			console.error("Error deleting row:", err);
		} finally {
			setLoading(false);
		}
	};

	const toggleStatus = async (row: Budgetable) => {
		setLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 250));

			setData((prev) =>
				prev.map((item) =>
					item.id === row.id
						? { ...item, status: item.status === "Paid" ? "Unpaid" : "Paid" }
						: item,
				),
			);
		} finally {
			setLoading(false);
		}
	};

	const total = data.reduce((sum, item) => sum + item.price, 0);

	return (
		<main className="container mx-auto p-4 max-w-5xl">
			{loading}
			<Header isEditing={isEditing} setIsEditing={setIsEditing} />
			<TableWrapper
				data={data}
				isEditing={isEditing}
				setData={setData}
				newRow={newRow}
				setNewRow={setNewRow}
				recentlyUpdatedRowId={recentlyUpdatedRowId}
				handleSave={handleSave}
				handleAddRow={handleAddRow}
				handleDeleteRow={handleDeleteRow}
				toggleStatus={toggleStatus}
			/>
			<TotalDisplay total={total} />
		</main>
	);
}
