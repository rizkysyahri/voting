import { Votes } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json({ message: "Kamu harus login terlebih dahulu. " });
  }

  const { code } = req.query;

  // Get Detail By Code
  if (req.method === "GET") {
    const result = await prisma.votes.findFirst({
      select: {
        id: true,
        publisher: true,
        title: true,
        code: true,
        startDateTime: true,
        endDateTime: true,
        candidates: true,
        createdAt: true,
        deletedAt: true,
      },
      where: {
        code: code as string,
        deletedAt: null,
      },
    });

    if (!result) {
      return res.status(404).json({ message: "NOT_FOUND" });
    }
    const response: Res<Votes> = {
      status: 200,
      data: result,
    };

    return res.json(response);
  }
  // Delete By COde

  if (req.method === "DELETE") {
    const result = await prisma.votes.update({
      where: {
        code: code as string,
      },
      data: {
        deletedAt: new Date().toString(),
      },
    });

    return res.json(result);
  }

  // Update by Code

  if (req.method === "PUT") {
    const result = await prisma.votes.update({
      where: {
        code: code as string,
      },
      data: {
        candidates: req.body.candidates,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime,
        title: req.body.title,
      },
    });
    return res.json(result);
  }
}
