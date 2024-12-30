import pb from "@/app/lib/pocketbase";

const { EMAIL, PASSWORD } = process.env;

async function authenticateSuperuser() {
  if (!pb.authStore.isValid) {
    await pb.collection("_superusers").authWithPassword(EMAIL!, PASSWORD!);
  }
}

export async function GET() {
  try {
    await authenticateSuperuser();
    const records = await pb.collection("budgetable").getFullList();
    return new Response(JSON.stringify(records), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to fetch data",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    await authenticateSuperuser();
    const data = await req.json();
    const record = await pb.collection("budgetable").create(data);
    return new Response(JSON.stringify(record), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding data:", error);
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to add data",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
