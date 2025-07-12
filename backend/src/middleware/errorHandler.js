export function errorHandler(err, req, res, next) {
    console.error('Error:', err.stack || err);
  
    // Handle specific error types
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON payload.' });
    }
  
    // Optional: handle auth errors from JWT
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
  
    // Generic fallback
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }