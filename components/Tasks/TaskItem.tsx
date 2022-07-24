import { FC } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Icon, Button, Table } from "semantic-ui-react";

interface Task {
  task_id: string;
  title: string;
  description: string;
  author_id: number;
  status: string;
  priority: number;
  date_due: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  t: Task;
  onClickDelete(): void;
}

const TaskItem: FC<Props> = ({ t, onClickDelete }) => {
  return (
    <Table.Row>
      <Table.Cell>
        <Link href={`/task/${t.task_id}`}>
          <a>{t.title}</a>
        </Link>
      </Table.Cell>
      <Table.Cell>{t.description}</Table.Cell>
      <Table.Cell>{t.status}</Table.Cell>
      <Table.Cell>{t.priority}</Table.Cell>
      <Table.Cell>{format(new Date(t.createdAt), "yyyy-MM-dd")}</Table.Cell>
      <Table.Cell>
        <Button
          data-testid="delete-task"
          animated="fade"
          color="red"
          onClick={() => {
            onClickDelete(t);
          }}
        >
          <Button.Content visible>Delete</Button.Content>
          <Button.Content hidden>
            <Icon name="delete" />
          </Button.Content>
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default TaskItem;
