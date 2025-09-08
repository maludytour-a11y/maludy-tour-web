// o "@prisma/client"

import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as typeof global & { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    errorFormat: "pretty",
    log: process.env.NODE_ENV === "production" ? [] : ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
