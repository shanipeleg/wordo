import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Records } from "@prisma/client";

type Response = {
  records?: Records[];
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "GET") {
    res.status(200).json({ success: false });
  }
  const records = await prisma.records.findMany({});

  res.status(200).json({ records, success: true });
}
