import { FC } from "react";
import Link from "next/link";
import { Form, Button, FormComponent } from "semantic-ui-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { Prisma } from "@prisma/client";
import { fetcher } from "../../utils/fetcher";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";

interface props{
  task: {
    task_id: number
    title: string,
    description: string,
    status: string,
    priority: number,
    date_due: Date
  }
}


const TaskForm:FC<props> = (props) => {
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);
  const [status, setStatus] = useState<any | null>(props.task.status);
  const [priority, setPriority] = useState<any | null>(props.task.priority);
  const [dateDue, setDateDue] = useState(props.task.date_due);
  const router = useRouter();
  const onChange = (event: any, data: any) => setDateDue(data.value);

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

  // const {form: Form} = props;
  return (
    <div>
    <Form onSubmit={async () => {
        const body: Prisma.TaskCreateInput = {
          title,
          description,
          status,
          priority,
          date_due: dateDue
        };
        if (props.task.task_id === undefined) {
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
      <SemanticDatepicker label="Date due" onChange={onChange} value={dateDue === null ? null : new Date(dateDue)} />
      <Form.Select
        label="Status"
        value={status}
        options={statusOptions}
        onChange={(e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => setStatus(data.value)}
      />
      <Form.Select
        label="Priority"
        value={priority}
        options={priorityOptions}
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
}

export default TaskForm;