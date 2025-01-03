import pb from "@/lib/pocketbase";
import { ResponseHelper } from "@/lib/helper";
import { RESPONSE } from "@/lib/const";
import { Budgetable } from "@/lib/utils";

const { INTERNAL_SERVER_ERROR, MISSING_ID, FAILED_TO_DELETE_DATA, FAILED_TO_UPDATE_DATA, INVALID_DATA, SUCCESS, CREATED } = RESPONSE;
const { EMAIL, PASSWORD, COLLECTION = "budgetable" } = process.env;

async function authenticateSuperuser(): Promise<void> {
  if (!EMAIL || !PASSWORD) {
    throw new Error("Environment variables EMAIL and PASSWORD must be set");
  }
  if (!pb.authStore.isValid) {
    await pb.collection("_superusers").authWithPassword(EMAIL, PASSWORD);
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await authenticateSuperuser();

    const id = (await context.params)?.id;
    if (!id) {
      return ResponseHelper.error(MISSING_ID);
    }

    const record: Budgetable = await pb.collection<Budgetable>(COLLECTION).getOne(id);
    return ResponseHelper.success<Budgetable>(record, CREATED.STATUS);
  } catch (error) {
    console.error("Error fetching data:", error);
    return ResponseHelper.error(INTERNAL_SERVER_ERROR, error);
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await authenticateSuperuser();

    const id = (await context.params)?.id;
    if (!id) {
      return ResponseHelper.error(MISSING_ID);
    }

    await pb.collection(COLLECTION).delete(id);
    return ResponseHelper.success(SUCCESS.MESSAGE);
  } catch (error) {
    console.error("Error deleting data:", error);
    return ResponseHelper.error(FAILED_TO_DELETE_DATA, error);
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await authenticateSuperuser();

    const id = (await context.params)?.id;
    if (!id) {
      return ResponseHelper.error(MISSING_ID);
    }

    const body: Partial<Budgetable> = await req.json();
    if (!body.title || typeof body.price !== "number") {
      return ResponseHelper.error(INVALID_DATA);
    }

    const updatedRecord: Budgetable = await pb
      .collection<Budgetable>(COLLECTION)
      .update(id, body);

    return ResponseHelper.success<Budgetable>(updatedRecord);
  } catch (error) {
    console.error("Error updating data:", error);
    return ResponseHelper.error(FAILED_TO_UPDATE_DATA, error);
  }
}
