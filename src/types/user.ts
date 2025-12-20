import type { User, Region } from '@prisma/client';

export type { User, Region };

export interface UserCredits {
  freeReadingsLeft: number;
  paidReadingsLeft: number;
  isLifetimeMember: boolean;
  lifetimeReadingsThisYear: number;
  totalReadingsAvailable: number;
}

export interface UserWithCredits extends User {
  credits: UserCredits;
}

export interface CreateUserInput {
  email: string;
  region: Region;
  referredBy?: string; // User ID of referrer
}
