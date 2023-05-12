import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import * as Joi from "joi";

type Response = {
  success: boolean;
  error?: string;
};

const requestBodySchema = Joi.object({
  wordsGuessed: Joi.number().min(1).max(200).integer().required().strict(),
  wordsSkipped: Joi.number().min(0).max(200).integer().required().strict(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { error } = requestBodySchema.validate(req.body);

  if (error) {
    res.status(400).json({ error: error.message, success: false });
    return;
  }

  let { wordsGuessed, wordsSkipped } = req.body;

  if (req.method !== "POST") {
    res.status(200).json({ success: false });
  }

  let score = wordsGuessed - (wordsSkipped > 0 ? wordsSkipped / 2 : 0);
  if (score < 0) score = 0;

  await prisma.records.create({
    data: {
      wordsGuessed,
      wordsSkipped,
      score,
    },
  });

  res.status(200).json({ success: true });
}
