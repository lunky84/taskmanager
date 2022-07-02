import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const readTask = async (req: NextApiRequest, res: NextApiResponse) => {
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
      const task = await prisma?.task.findUnique({
        where: {
          task_id: parseInt(task_id as string),
        },
      });
      res.status(200).json(task);
    } else {
      const searchOptions = {
        skip: (parseInt(page as string, 10) - 1) * 4,
        take: 4,
        orderBy: [
          {
            [orderBy as string]: sort,
          },
        ],
        where: {},
      };
      const countOptions = { where: {} };
      if (priority !== "all") {
        const whereClause = {
          priority: {
            equals: parseInt(priority as string, 10),
          },
        };
        searchOptions.where = whereClause;
        countOptions.where = whereClause;
      }

      const [tasks, count]: any = await prisma?.$transaction([
        prisma.task.findMany(searchOptions),
        prisma.task.count(countOptions),
      ]);

      res.status(200).json({ tasks: tasks, count: count });
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong!" + task_id });
  }
};

export default readTask;
