import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export interface Budgetable {
	id: string;
	title: string;
	price: number;
	link: string;
	note?: string;
	status: "Paid" | "Unpaid";
}

export const areRowsEqual = (row1: Budgetable, row2: Budgetable): boolean => {
	const normalize = (value: string | number | undefined) =>
		String(value ?? "").trim();

	const areEqual = (field: keyof Budgetable) =>
		field === "price"
			? Number(row1[field]) === Number(row2[field])
			: normalize(row1[field]) === normalize(row2[field]);

	return ["title", "price", "link", "note", "status"].every((field) =>
		areEqual(field as keyof Budgetable),
	);
};
