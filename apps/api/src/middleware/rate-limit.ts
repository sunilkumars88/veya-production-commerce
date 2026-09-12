const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(maxRequests: number, windowMs: number) {
  return (req: any, res: any, next: any) => {
    const key = req.ip + ':' + req.path;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.reset) {
      buckets.set(key, { count: 1, reset: now + windowMs });
      return next();
    }

    bucket.count++;
    if (bucket.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many requests' },
      });
    }
    next();
  };
}
