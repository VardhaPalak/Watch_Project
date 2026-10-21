export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, _next) {
  const status = err.statusCode || err.status || 500;
  const payload = {
    message: status === 500 ? "Something went wrong on our side. Please try again." : err.message,
  };

  if (err.name === "ValidationError") {
    payload.message = "Some of the submitted details are invalid.";
    payload.errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, value]) => [key, value.message]),
    );
  }

  if (err.code === 11000) {
    payload.message = "That record already exists.";
    payload.errors = { key: Object.keys(err.keyValue || {})[0] || "field" };
  }

  if (err.name === "MulterError") {
    payload.message = "The attachment could not be processed.";
  }

  if (status >= 500) {
    console.error("[error]", err);
  }

  res.status(status).json(payload);
}
