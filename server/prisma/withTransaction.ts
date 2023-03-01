import { Prisma, PrismaClient } from "@prisma/client";
import prismaClient from "./prismaclient";

type PrismaTransaction = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;

export function withTransaction<R>(
  block: (transaction: PrismaTransaction) => Promise<R>,
): Promise<R> {
  return prismaClient.$transaction(block);
}
