import React, { useEffect } from "react";
import {
  Button,
  Container,
  Divider,
  Form,
  Header,
  Icon,
  Image,
  Table,
  Pagination,
} from "semantic-ui-react";
import { NextSeo } from "next-seo";
import { useState } from "react";
import { Prisma } from "@prisma/client";
import { fetcher } from "../utils/fetcher";
import prisma from "../lib/prisma";
import { useRouter } from "next/router";

export async function getServerSideProps({ query: { page = 1 } }) {
  const tasks = await fetcher(`/api/task/read?page=${page}`, null);
  const count = await prisma.task.count();
  return {
    props: { initialTasks: tasks, taskCount: count, currentPage: page },
  };
}

export default function tasks(props) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Prisma.TaskUncheckedCreateInput[]>(props.initialTasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(props.currentPage);

  const pagginationHandler = async (activePage: number) => {
    setCurrentPage(activePage);
    router.push(`tasks?page=${activePage}`, undefined, { shallow: true });
    const tasks = await fetcher(`/api/task/read?page=${activePage}`, null);
    setTasks(tasks);
  };

  const pageCount: number = Math.ceil(props.taskCount / 4);

  return (
    <Container style={{ margin: 20 }}>
      <NextSeo title="Tasks" description="The tasks page" />

      <h1>Tasks</h1>
      <Form
        onSubmit={async () => {
          const body: Prisma.TaskCreateInput = {
            title,
            description,
          };

          await fetcher("/api/task/create", { task: body });
          await setTasks([...tasks, body]);
          setTitle("");
          setDescription("");
        }}
      >
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Form.TextArea
            label="Description"
            placeholder="Tell us more"
            style={{ minHeight: 100 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Button>Submit</Form.Button>
      </Form>

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
                  <Header.Content>{t.title}</Header.Content>
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

      <Pagination
        boundaryRange={0}
        defaultActivePage={1}
        ellipsisItem={null}
        firstItem={null}
        lastItem={null}
        siblingRange={1}
        totalPages={pageCount}
        activePage={currentPage}
        onPageChange={(event, data) => pagginationHandler(data.activePage)}
      />
    </Container>
  );
}
