import type { NextApiRequest, NextApiResponse } from "next";
import authOptions from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });

  console.log("Session", session);

  res.status(200).json({ session });
}
