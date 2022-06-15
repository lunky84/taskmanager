import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

export default async (req, res) => {
  const query = req.query;
  const { page } = query;
  try {
    const tasks: Prisma.TaskUncheckedCreateInput[] = await prisma.task.findMany({
      skip: (parseInt(page, 10) - 1) * 4,
      take: 4,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong!" + page });
  }
};
