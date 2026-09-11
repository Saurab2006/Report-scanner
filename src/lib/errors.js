export class AppError extends Error {
  constructor(code, message, status = 500, details = null) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function errorResponse(error) {
  if (error instanceof AppError) {
    return {
      status: error.status,
      body: {
        success: false,
        code: error.code,
        error: error.message,
      },
    };
  }

  console.error("[ReportScan] Unexpected error", error);
  return {
    status: 500,
    body: {
      success: false,
      code: "server_error",
      error: "Something went wrong while processing the report.",
    },
  };
}
