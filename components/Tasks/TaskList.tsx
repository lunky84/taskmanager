import { FC } from "react";
import { Table } from "semantic-ui-react";
import TaskItem from "@/components/Tasks/TaskItem";

const TaskList: FC<any> = ({ onClickSort, onClickDelete, config, tasks }) => {
  return (
    <Table sortable celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            data-testid="sort-by-title"
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
            data-testid="sort-by-createdAt"
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
          <TaskItem key={index} t={t} onClickDelete={onClickDelete}></TaskItem>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TaskList;
