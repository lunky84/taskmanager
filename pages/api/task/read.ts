import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

const readTask = async (req, res) => {
  const query = req.query;
  const { task_id = null, page = 1, orderBy = "title", sort = "asc" } = query;
  try {
    if (task_id != null) {
      const task = await prisma.task.findUnique({
        where: {
          task_id: parseInt(task_id),
        },
      });
      res.status(200).json(task);
    } else {
      const tasks: Prisma.TaskUncheckedCreateInput[] =
        await prisma.task.findMany({
          skip: (parseInt(page, 10) - 1) * 4,
          take: 4,
          orderBy: [
            {
              [orderBy]: sort,
            },
          ],
        });
      res.status(200).json(tasks);
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong!" + task_id });
  }
};

export default readTask;
