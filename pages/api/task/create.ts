// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const createTask = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { task } = req.body;
    const savedTask = await prisma?.task.create({
      data: task,
    });
    res.status(200).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

export default createTask;
