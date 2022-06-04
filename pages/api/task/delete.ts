import prisma from "../../lib/prisma";

export default async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.json({ error: "You should have an id!" });
      return;
    }
    const task = await prisma.task.delete({
      where: { id },
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong!" });
  }
};
