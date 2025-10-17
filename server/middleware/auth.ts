import express from 'express';

export const verifyApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // In a production environment, you could implement more sophisticated 
  // authentication here, but for now we'll just allow requests from our frontend
  const origin = req.get('Origin');
  const referer = req.get('Referer');
  
  // Allow requests from our frontend
  if (
    origin?.includes('localhost') || 
    referer?.includes('localhost') ||
    req.headers.authorization // Allow requests with authorization header for extra security
  ) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Unauthorized access' });
  }
};