import { FC } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Icon, Button, Table } from "semantic-ui-react";

const TaskItem: FC<any> = ({ t, onClickDelete }) => {
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
      <Table.Cell>
        {format(new Date(t.createdAt as string), "yyyy-MM-dd")}
      </Table.Cell>
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
