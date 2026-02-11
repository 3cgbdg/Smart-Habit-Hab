import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

export type RequestWithCookies = Omit<Request, 'cookies'> & {
  cookies: Record<string, string | undefined>;
};

export interface JwtPayload {
  userId: string;
}
