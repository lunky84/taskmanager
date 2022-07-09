import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

interface User {
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  avatar: string;
}

const users: User[] = [];

function createRandomUser(): User {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    role: "USER",
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
  };
}

interface Task {
  title: string;
  description: string;
  status: string;
  priority: number;
  createdAt: Date;
}

const statuses = ["Pending", "Active", "Complete"];

const randomStatus = () => {
  return faker.datatype.number({
    min: 0,
    max: statuses.length - 1,
  });
};

const tasks: Task[] = [];

function createRandomTask(): Task {
  return {
    title: faker.lorem.words(10),
    description: faker.lorem.paragraph(3),
    status: statuses[randomStatus()],
    priority: faker.datatype.number({
      min: 1,
      max: 3,
    }),
    createdAt: faker.date.past(),
  };
}

Array.from({ length: 100 }).forEach(() => {
  tasks.push(createRandomTask());
});

const prisma = new PrismaClient();

async function main() {
  for (let user of users) {
    await prisma.user.create({
      data: user,
    });
  }
  for (let task of tasks) {
    await prisma.task.create({
      data: task,
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
