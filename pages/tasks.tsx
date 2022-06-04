import React from "react";
import { Button, Container, Divider, Form, Header, Icon, Image, Table } from "semantic-ui-react";
import { NextSeo } from "next-seo";
import { useState } from "react";
import { Prisma } from "@prisma/client";
import { fetcher } from "../utils/fetcher";
import prisma from "../lib/prisma";

export async function getServerSideProps() {
  const tasks: Prisma.TaskUncheckedCreateInput[] = await prisma.task.findMany();
  return {
    props: { initialTasks: tasks },
  };
}

export default function tasks({ initialTasks }) {
  const [tasks, setTasks] = useState<Prisma.TaskUncheckedCreateInput[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Container style={{ margin: 20 }}>
      <NextSeo title="Tasks" description="The tasks page" />
      <h1>Tasks</h1>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell collapsing>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {tasks.map((t, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Header as="h4" image>
                  <Header.Content>
                    {t.title}
                  </Header.Content>
                </Header>
              </Table.Cell>
              <Table.Cell>{t.description}</Table.Cell>
              <Table.Cell>
                <Button
                  animated="fade"
                  color="red"
                  onClick={async () => {
                    await fetcher("/api/task/delete", { task_id: t.task_id });
                    await setTasks(tasks.filter((task) => task !== t));
                  }}
                >
                  <Button.Content visible>Delete</Button.Content>
                  <Button.Content hidden>
                    <Icon name="delete" />
                  </Button.Content>
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
}
