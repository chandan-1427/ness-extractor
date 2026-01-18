import type { Request, Response, NextFunction } from 'express';
import type { ZodObject } from 'zod';

export const validate =
  (schema: ZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Pass the ZodError to your global error handler
      return next(result.error);
    }

    // Replace req.body with the validated (and potentially transformed) data
    req.body = result.data;
    next();
  };