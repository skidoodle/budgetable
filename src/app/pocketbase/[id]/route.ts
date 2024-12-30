import pb from "@/lib/pocketbase";

const { EMAIL, PASSWORD } = process.env;

async function authenticateSuperuser() {
	if (!EMAIL || !PASSWORD) {
		throw new Error("Environment variables EMAIL and PASSWORD must be set");
	}
	if (!pb.authStore.isValid) {
		await pb.collection("_superusers").authWithPassword(EMAIL, PASSWORD);
	}
}

export async function GET(
	req: Request,
	context: { params: Promise<{ id: string }> },
) {
	try {
		await authenticateSuperuser();

		const id = (await context.params)?.id;
		if (!id) {
			return new Response(
				JSON.stringify({ error: { message: "Missing ID in request" } }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		const record = await pb.collection("budgetable").getOne(id);
		return new Response(JSON.stringify(record), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error fetching data:", error);
		return new Response(
			JSON.stringify({ error: { message: "Failed to fetch data" } }),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
}

export async function DELETE(
	req: Request,
	context: { params: Promise<{ id: string }> },
) {
	try {
		await authenticateSuperuser();

		const id = (await context.params)?.id;
		if (!id) {
			return new Response(
				JSON.stringify({ error: { message: "Missing ID in request" } }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		await pb.collection("budgetable").delete(id);
		return new Response(JSON.stringify({ success: true }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error deleting data:", error);
		return new Response(
			JSON.stringify({ error: { message: "Failed to delete data" } }),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
}

export async function PUT(
	req: Request,
	context: { params: Promise<{ id: string }> },
) {
	try {
		await authenticateSuperuser();

		const id = (await context.params)?.id; // Use `context.params?.id`
		if (!id) {
			return new Response(
				JSON.stringify({ error: { message: "Missing ID in request" } }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		const body = await req.json();
		if (!body.title || typeof body.price !== "number") {
			return new Response(
				JSON.stringify({ error: { message: "Invalid data provided" } }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		const updatedRecord = await pb.collection("budgetable").update(id, body);
		return new Response(JSON.stringify(updatedRecord), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error updating data:", error);
		return new Response(
			JSON.stringify({ error: { message: "Failed to update data" } }),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
}
