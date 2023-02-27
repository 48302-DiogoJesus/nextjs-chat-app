import { z } from "zod";

export const UUID = z.string().uuid();
export const Email = z.string().email();

export type UUID = z.infer<typeof UUID>;
