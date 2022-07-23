import { FC } from "react";
import Link from "next/link";
import { Form, Button } from "semantic-ui-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { Prisma } from "@prisma/client";
import { fetcher } from "../../utils/fetcher";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";

interface props {
  task: {
    task_id: string | null;
    title: string;
    description: string;
    status: string;
    priority: number;
    date_due: Date | null;
  };
}

const TaskForm: FC<props> = (props) => {
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);
  const [status, setStatus] = useState<string>(props.task.status);
  const [priority, setPriority] = useState<any | null>(props.task.priority);
  const [dateDue, setDateDue] = useState(props.task.date_due);
  const router = useRouter();

  return (
    <div>
      <Form
        onSubmit={async () => {
          const body: Prisma.TaskCreateInput = {
            title,
            description,
            status,
            priority,
            date_due: dateDue,
          };
          if (props.task.task_id === null) {
            await fetcher("/api/task/create", { task: body });
          } else {
            await fetcher("/api/task/update", {
              task: body,
              id: props.task.task_id,
            });
          }
          router.push("/tasks");
        }}
      >
        <Form.Input
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
        <SemanticDatepicker
          label="Date due"
          onChange={(e, data: any) => setDateDue(data.value)}
          value={dateDue === null ? null : new Date(dateDue)}
        />
        <Form.Select
          label="Status"
          value={status}
          options={[
            { text: "Pending", value: "Pending" },
            { text: "Active", value: "Active" },
            { text: "Completed", value: "Completed" },
          ]}
          onChange={(e, data: any) => setStatus(data.value)}
        />
        <Form.Select
          label="Priority"
          value={priority}
          options={[
            { text: "Low", value: 1 },
            { text: "Medium", value: 2 },
            { text: "High", value: 3 },
          ]}
          onChange={(e, data) => setPriority(data.value)}
        />

        <Button primary type="submit">
          Save
        </Button>
        <Link href="/tasks" passHref>
          <Button>Cancel</Button>
        </Link>
      </Form>
    </div>
  );
};

export default TaskForm;
