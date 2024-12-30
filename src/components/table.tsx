"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Link from "next/link";

interface Budgetable {
  id: string;
  title: string;
  price: number;
  link: string;
  note?: string;
  status: "Paid" | "Unpaid";
}

const TableComponent = () => {
  const [data, setData] = useState<Budgetable[]>([]);
  const [newRow, setNewRow] = useState<Budgetable>({
    id: "",
    title: "",
    price: 0,
    link: "",
    note: "",
    status: "Unpaid",
  });
  const [recentlyUpdatedRowId, setRecentlyUpdatedRowId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSave = async (updatedRow: Budgetable, originalRow: Budgetable) => {

    if (
      updatedRow.title === originalRow.title &&
      updatedRow.price === originalRow.price &&
      updatedRow.link === originalRow.link &&
      updatedRow.note === originalRow.note &&
      updatedRow.status === originalRow.status
    ) {
      return;
    }

    try {
      const res = await fetch(`/pocketbase/${updatedRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRow),
      });
      if (!res.ok) throw new Error("Failed to update row");
      setData((prev) =>
        prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
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
      setNewRow({ id: "", title: "", price: 0, link: "", note: "", status: "Unpaid" });
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
    const updatedStatus: "Paid" | "Unpaid" = row.status === "Paid" ? "Unpaid" : "Paid";
    const updatedRow: Budgetable = { ...row, status: updatedStatus };
    await handleSave(updatedRow, row);
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? updatedRow : item))
    );
  };

  const total = data.reduce((sum, item) => sum + (item.status === "Unpaid" ? item.price : 0), 0);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Budgetable</h1>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Lock" : "Unlock"} Editing
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
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
                            item.id === row.id
                              ? { ...item, title: e.target.value }
                              : item
                          )
                        )
                      }
                      onBlur={() => handleSave(row, data.find((r) => r.id === row.id)!)}
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
                              ? { ...item, price: parseFloat(e.target.value) || 0 }
                              : item
                          )
                        )
                      }
                      onBlur={() => handleSave(row, data.find((r) => r.id === row.id)!)}
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
                            item.id === row.id
                              ? { ...item, link: e.target.value }
                              : item
                          )
                        )
                      }
                      onBlur={() => handleSave(row, data.find((r) => r.id === row.id)!)}
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
                            item.id === row.id
                              ? { ...item, note: e.target.value }
                              : item
                          )
                        )
                      }
                      onBlur={() => handleSave(row, data.find((r) => r.id === row.id)!)}
                    />
                  ) : (
                    <span>{row.note || "-"}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={row.status === "Paid" ? "destructive" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleStatus(row)}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {isEditing && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">Delete</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          Are you sure you want to delete this row?
                        </DialogHeader>
                        <DialogFooter>
                          <Button onClick={() => handleDeleteRow(row.id)}>Yes, delete</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {/* New Row */}
            {isEditing && (
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
                        price: parseFloat(e.target.value) || 0,
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
                <TableCell></TableCell>
                <TableCell>
                  <Button onClick={handleAddRow}>Add</Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <div className="mt-4 text-right font-bold text-lg">
        Total: {total.toLocaleString()}
      </div>
    </div>
  );
};

export default TableComponent;
