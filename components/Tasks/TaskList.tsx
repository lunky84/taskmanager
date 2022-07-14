import { FC } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Icon, Button, Table } from "semantic-ui-react";

const TaskList: FC<any> = ({ onClickSort, onClickDelete, config, tasks }) => {
  return (
    <Table sortable celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            sorted={
              config.order === "title"
                ? config.sort === "asc"
                  ? "ascending"
                  : "descending"
                : undefined
            }
            onClick={() => {
              onClickSort("title");
            }}
          >
            Title
          </Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Priority</Table.HeaderCell>
          <Table.HeaderCell
            sorted={
              config.order === "createdAt"
                ? config.sort === "asc"
                  ? "ascending"
                  : "descending"
                : undefined
            }
            onClick={() => {
              onClickSort("createdAt");
            }}
          >
            Created
          </Table.HeaderCell>
          <Table.HeaderCell collapsing>Action</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {tasks.map((t: any, index: number) => (
          <Table.Row key={index}>
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
        ))}
      </Table.Body>
    </Table>
  );
};

export default TaskList;
