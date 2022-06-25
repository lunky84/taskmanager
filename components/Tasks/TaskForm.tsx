import React from "react";
import Link from "next/link";
import { Form, Button } from "semantic-ui-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { Prisma } from "@prisma/client";
import { fetcher } from "../../utils/fetcher";

export default function TaskForm(props) {
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);
  const [status, setStatus] = useState(props.task.status);
  const [priority, setPriority] = useState(props.task.priority);
  const router = useRouter();

  const statusOptions = [
    { text: "Pending", value: "Pending" },
    { text: "Active", value: "Active" },
    { text: "Completed", value: "Completed" },
  ];

  const priorityOptions = [
    { text: "Low", value: 1 },
    { text: "Medium", value: 2 },
    { text: "High", value: 3 },
  ];

  return (
    <Form
      onSubmit={async () => {
        const body: Prisma.TaskCreateInput = {
          title,
          description,
          status,
          priority
        };
        await fetcher("/api/task/update", {
          task: body,
          id: props.task.task_id,
        });
        router.push("/tasks");
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
        <Form.Select
          fluid
          label="Status"
          value={status}
          options={statusOptions}
          onChange={(e, data) => setStatus(data.value)}
        />
        <Form.Select
          fluid
          label="Priority"
          value={priority}
          options={priorityOptions}
          onChange={(e, data) => setPriority(data.value)}
        />
      </Form.Group>
      <Button primary type="submit">
        Save
      </Button>
      <Link href="/tasks" passHref>
        <Button>Cancel</Button>
      </Link>
    </Form>
  );
}
