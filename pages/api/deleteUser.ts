import prisma from "../../lib/prisma";

export default async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      res.json({ error: "You should have an user_id!" });
      return;
    }
    const user = await prisma.user.delete({
      where: { user_id },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong!" });
  }
};
