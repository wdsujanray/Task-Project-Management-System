function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ message: 'Request body contains invalid JSON' });
  }

  const status = error.status || error.statusCode;
  if (status >= 400 && status < 500) {
    return res.status(status).json({
      message: status === 404 ? 'Route not found' : 'Request could not be processed',
    });
  }

  console.error(error);
  res.status(500).json({ message: 'An unexpected server error occurred' });
}

module.exports = errorHandler;
