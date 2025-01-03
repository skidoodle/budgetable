import pb from "@/lib/pocketbase";
import { ResponseHelper } from "@/lib/helper";
import { RESPONSE } from "@/lib/const";
import type { Budgetable } from "@/lib/utils";

const { INTERNAL_SERVER_ERROR } = RESPONSE;
const { EMAIL, PASSWORD, COLLECTION = "budgetable" } = process.env;

async function authenticateSuperuser(): Promise<void> {
	if (!EMAIL || !PASSWORD) {
		throw new Error("Environment variables EMAIL and PASSWORD must be set");
	}
	if (!pb.authStore.isValid) {
		await pb.collection("_superusers").authWithPassword(EMAIL, PASSWORD);
	}
}

export async function GET(): Promise<Response> {
	try {
		await authenticateSuperuser();

		const records: Budgetable[] = await pb
			.collection<Budgetable>(COLLECTION)
			.getFullList();

		return ResponseHelper.success<Budgetable[]>(records);
	} catch (error) {
		console.error("Error fetching data:", error);
		return ResponseHelper.error(INTERNAL_SERVER_ERROR, error);
	}
}

export async function POST(req: Request): Promise<Response> {
	try {
		await authenticateSuperuser();

		const data: Omit<Budgetable, "id"> = await req.json();

		const record: Budgetable = await pb
			.collection<Budgetable>(COLLECTION)
			.create(data);

		return ResponseHelper.success<Budgetable>(record);
	} catch (error) {
		console.error("Error adding data:", error);
		return ResponseHelper.error(INTERNAL_SERVER_ERROR, error);
	}
}
