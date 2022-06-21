import { Container, Form } from "semantic-ui-react";
import { NextSeo } from "next-seo";
import { fetcher } from "../../utils/fetcher";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { useRouter } from 'next/router'

export async function getServerSideProps({ query: { task_id } }) {
  const task = await fetcher(`/api/task/read?task_id=${task_id}`, null);
  return {
    props: {
      task: task
    },
  };
}

export default function Task(props) {
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);
  const router = useRouter();

  return (
    <>
      <Container style={{ margin: 20 }}>
        <NextSeo title="Task" description="The tasks page" />

        <h1>{props.task.title}</h1>
        {props.task.task_id}
        <Form
          onSubmit={async () => {
            const body: Prisma.TaskCreateInput = {
              title,
              description,
            };
            await fetcher("/api/task/update", { task: body, id: props.task.task_id });
            router.push("/tasks")
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
      </Container>
    </>
  );
}
