import { ResponseHelper } from "@/lib/helper";
import { RESPONSE } from "@/lib/const";

const { INTERNAL_SERVER_ERROR } = RESPONSE;

export async function GET(): Promise<Response> {
	try {
		return ResponseHelper.success("Healthy");
	} catch (error) {
        console.error("Health check failed:", error);
		return ResponseHelper.error(INTERNAL_SERVER_ERROR, error);
	}
}
