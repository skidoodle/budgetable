import pb from "@/lib/pocketbase";

const { EMAIL, PASSWORD, COLLECTION = "budgetable" } = process.env;

async function authenticateSuperuser() {
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
) {
  try {
    await authenticateSuperuser();

    const id = (await context.params)?.id;
    if (!id) {
      return Response.json(
        {
          error: {
            message: "Missing ID in request",
          },
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const record = await pb.collection(COLLECTION).getOne(id);
    return Response.json(record, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json(
      {
        error: {
          message: "Failed to fetch data",
        },
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await authenticateSuperuser();

    const id = (await context.params)?.id;
    if (!id) {
      return Response.json(
        {
          error: {
            message: "Missing ID in request",
          },
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await pb.collection(COLLECTION).delete(id);
    return Response.json(
      {
        success: true,
      },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting data:", error);
    return Response.json(
      {
        error: {
          message: "Failed to delete data",
        },
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await authenticateSuperuser();

    const id = (await context.params)?.id;
    if (!id) {
      return Response.json(
        {
          error: {
            message: "Missing ID in request",
          },
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();
    if (!body.title || typeof body.price !== "number") {
      return Response.json(
        {
          error: {
            message: "Invalid data provided",
          },
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updatedRecord = await pb.collection(COLLECTION).update(id, body);
    return Response.json(updatedRecord, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating data:", error);
    return Response.json(
      {
        error: {
          message: "Failed to update data",
        },
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
