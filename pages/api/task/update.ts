// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const updateTask = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { task, id } = req.body;
    const updatedTask = await prisma?.task.update({
      where: {
        task_id: id,
      },
      data: task,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

export default updateTask;
