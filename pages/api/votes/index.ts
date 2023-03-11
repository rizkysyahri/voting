import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";
import { code } from "../../../lib/code";
import { Votes } from "@prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json({ message: "Kamu harus login terlebih dahulu." });
  }

  // Create New
  if (req.method === "POST") {
    const result = await prisma.votes.create({
      data: {
        candidates: req.body.candidates,
        endDateTime: req.body.endDateTime,
        startDateTime: req.body.startDateTime,
        title: req.body.title,
        publisher: req.body.publisher,
        code: code(6),
        deletedAt: null,
      },
    });

    return res.json(result);
  }

  // Get all by user
  if (req.method === "GET") {
    const result = await prisma.votes.findMany({
      where: {
        AND: [{ deletedAt: null }, { publisher: session?.user?.email! }],
      },
    });

    const response: Res<Votes[]> = {
      status: 200,
      data: result,
    };
    return res.json(response);
  }

  return res.status(200).json({ data: "Hello world" });
}
