"use client";

import { useState, useEffect, useCallback } from "react";
import TableWrapper from "@/components/table-wrapper";
import Header from "@/components/header";
import TotalDisplay from "@/components/total-display";
import { toast } from "sonner";
import { type Budgetable, areRowsEqual } from "@/lib/utils";

const DEFAULT_NEW_ROW: Budgetable = {
  id: "",
  title: "",
  price: 0,
  link: "",
  note: "",
  status: "Unpaid",
};

const ENDPOINT = "/pocketbase";

export default function App() {
  const [data, setData] = useState<Budgetable[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newRow, setNewRow] = useState<Budgetable>(DEFAULT_NEW_ROW);
  const [recentlyUpdatedRowId, setRecentlyUpdatedRowId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) throw new Error("Failed to fetch data");
      const records: Budgetable[] = await res.json();
      setData(records);
    } catch (err) {
      toast.error("Error fetching data. Please try again later.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = useCallback(async (updatedRow: Budgetable, originalRow: Budgetable) => {
    if (areRowsEqual(updatedRow, originalRow)) return;

    try {
      const res = await fetch(`${ENDPOINT}/${updatedRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRow),
      });
      if (!res.ok) throw new Error("Failed to update row");

      const updatedData = await res.json();
      setData((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedData : row)));

      setRecentlyUpdatedRowId(updatedRow.id);
      setTimeout(() => setRecentlyUpdatedRowId(null), 500);
      toast.success("Row updated successfully!");
    } catch (err) {
      toast.error("Error updating row. Please try again.");
      console.error(err);
    }
  }, []);

  const handleAddRow = useCallback(async () => {
    if (!newRow.title || newRow.price <= 0) {
      toast.error("Title and price are required.");
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });
      if (!res.ok) throw new Error("Failed to add row");

      const record: Budgetable = await res.json();
      setData((prev) => [...prev, record]);
      setNewRow(DEFAULT_NEW_ROW);
      toast.success("Row added successfully!");
    } catch (err) {
      toast.error("Error adding row. Please try again.");
      console.error(err);
    }
  }, [newRow]);

  const handleDeleteRow = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${ENDPOINT}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete row");

      setData((prev) => prev.filter((row) => row.id !== id));
      toast.success("Row deleted successfully!");
    } catch (err) {
      toast.error("Error deleting row. Please try again.");
      console.error(err);
    }
  }, []);

  const toggleStatus = useCallback(async (row: Budgetable) => {
    const updatedStatus = row.status === "Paid" ? "Unpaid" : "Paid";
    const updatedRow: Budgetable = { ...row, status: updatedStatus as "Paid" | "Unpaid" };
    await handleSave(updatedRow, row);
  }, [handleSave]);

  const total = data.reduce(
    (sum, item) => sum + (item.status === "Unpaid" ? item.price : 0),
    0,
  );

  return (
    <main className="container mx-auto p-4 max-w-7xl">
      <Header isEditing={isEditing} setIsEditing={setIsEditing} />
      <TotalDisplay total={total} />
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
    </main>
  );
}
