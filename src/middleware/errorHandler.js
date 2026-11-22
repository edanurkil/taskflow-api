function notFound(req, res) {
  res.status(404).json({
    error: "Endpoint bulunamadı",
    path: req.originalUrl
  });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Geçersiz JSON formatı" });
  }
  console.error(error);
  return res.status(500).json({ error: "Beklenmeyen sunucu hatası" });
}

module.exports = { notFound, errorHandler };
