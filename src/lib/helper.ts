import { RESPONSE } from "@/lib/const";

interface ErrorResponse {
  error: {
    message: string;
    details?: unknown;
  };
}

type SuccessResponse<T> = T;

type ResponseData<T> = SuccessResponse<T> | ErrorResponse;

interface ResponseOptions {
  status?: number;
}

export class ResponseHelper<T = unknown> {
  private data: ResponseData<T>;
  private status: number;

  constructor(data: ResponseData<T>, options: ResponseOptions = {}) {
    this.data = data;
    this.status = options.status || 200;
  }

  static success<T>(data: T, status = RESPONSE.SUCCESS.STATUS): Response {
    return new ResponseHelper<T>(data, { status }).toResponse();
  }

  static error(
    constant: (typeof RESPONSE)[keyof typeof RESPONSE],
    details?: unknown
  ): Response {
    return new ResponseHelper<ErrorResponse>(
      { error: { message: constant.MESSAGE, details } },
      { status: constant.STATUS }
    ).toResponse();
  }

  toResponse(): Response {
    return Response.json(this.data, {
      status: this.status,
    });
  }
}
