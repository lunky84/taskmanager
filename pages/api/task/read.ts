import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const readTask = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const {
    task_id = null,
    page = 1,
    order = "title",
    sort = "asc",
    priority = "all",
    status = "all",
    search = "",
  } = query;
  try {
    if (task_id != null) {
      const task = await prisma?.task.findUnique({
        where: {
          task_id: task_id as string,
        },
      });
      res.status(200).json(task);
    } else {
      const searchOptions: any = {
        skip: (parseInt(page as string, 10) - 1) * 4,
        take: 4,
        orderBy: [
          {
            [order as string]: sort,
          },
        ],
        where: {},
      };
      const countOptions: any = { where: {} };
      if (priority !== "all") {
        searchOptions.where.priority = {
          equals: parseInt(priority as string, 10),
        };
        countOptions.where.priority = {
          equals: parseInt(priority as string, 10),
        };
      }
      if (status !== "all") {
        searchOptions.where.status = {
          equals: status,
        };
        countOptions.where.status = {
          equals: status,
        };
      }

      if (search !== "") {
        searchOptions.where.task_id = {
          search: search,
        };
        countOptions.where.task_id = {
          search: search,
        };
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
