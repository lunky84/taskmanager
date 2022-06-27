import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

const readTask = async (req, res) => {
  const query = req.query;
  const {
    task_id = null,
    page = 1,
    orderBy = "title",
    sort = "asc",
    priority = "all",
  } = query;
  try {
    if (task_id != null) {
      const task = await prisma.task.findUnique({
        where: {
          task_id: parseInt(task_id),
        },
      });
      res.status(200).json(task);
    } else {
      const options = {
        skip: (parseInt(page, 10) - 1) * 4,
        take: 4,
        orderBy: [
          {
            [orderBy]: sort,
          },
        ],
        where: {},
      };
      if (priority !== "all") {
        options.where = {
          priority: {
            equals: parseInt(priority, 10),
          },
        };
      }

      const tasks: Prisma.TaskUncheckedCreateInput[] =
        await prisma.task.findMany(options);
      res.status(200).json(tasks);
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong!" + task_id });
  }
};

export default readTask;
