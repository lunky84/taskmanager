import prisma from "../../../lib/prisma";

export default async (req, res) => {
  try {
    const { task_id } = req.body;
    if (!task_id) {
      res.json({ error: "You should have an task_id!" });
      return;
    }
    const task = await prisma.task.delete({
      where: { task_id },
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong!" });
  }
};
