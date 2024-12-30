"use client";

import { useState, useEffect } from "react";
import TableWrapper from "@/components/table-wrapper";
import Header from "@/components/header";
import TotalDisplay from "@/components/total-display";
import { toast } from "sonner";
import { Budgetable, areRowsEqual } from "@/lib/utils";

export default function App() {
	const [data, setData] = useState<Budgetable[]>(() => []);
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
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
		if (areRowsEqual(updatedRow, originalRow)) {
			return;
		}

		try {
			const res = await fetch(`/pocketbase/${updatedRow.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedRow),
			});
			if (!res.ok) throw new Error("Failed to update row");
			const updatedData = await res.json();
			setData((prev) =>
				prev.map((row) => (row.id === updatedRow.id ? updatedData : row)),
			);

			setRecentlyUpdatedRowId(updatedRow.id);
			setTimeout(() => setRecentlyUpdatedRowId(null), 500);
			toast.success("Row updated successfully!");
		} catch (err) {
			toast.error("Error updating row. Please try again.");
			console.error("Error updating row:", err);
		}
	};

	const handleAddRow = async () => {
		if (!newRow.title || newRow.price <= 0) {
			toast("Title and price are required.");
			return;
		}

		try {
			const res = await fetch("/pocketbase", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newRow),
			});
			if (!res.ok) throw new Error("Failed to add row");
			const record: Budgetable = await res.json();
			setData((prev) => [...prev, record]);
			setNewRow({
				id: "",
				title: "",
				price: 0,
				link: "",
				note: "",
				status: "Unpaid",
			});
			toast.success("Row added successfully!");
		} catch (err) {
			toast.error("Error adding row. Please try again.");
			console.error("Error adding row:", err);
		}
	};

	const handleDeleteRow = async (id: string) => {
		try {
			const res = await fetch(`/pocketbase/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Failed to delete row");
			setData((prev) => prev.filter((row) => row.id !== id));
			toast.success("Row deleted successfully!");
		} catch (err) {
			toast.error("Error deleting row. Please try again.");
			console.error("Error deleting row:", err);
		}
	};

	const toggleStatus = async (row: Budgetable) => {
		const updatedStatus: "Paid" | "Unpaid" =
			row.status === "Paid" ? "Unpaid" : "Paid";
		const updatedRow: Budgetable = { ...row, status: updatedStatus };
		await handleSave(updatedRow, row);
		setData((prev) =>
			prev.map((item) => (item.id === row.id ? updatedRow : item)),
		);
	};

	const total = data.reduce(
		(sum, item) => sum + (item.status === "Unpaid" ? item.price : 0),
		0,
	);

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
