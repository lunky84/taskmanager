import React, { useEffect } from "react";
import { useState } from "react";

import { Prisma } from "@prisma/client";
import { format } from 'date-fns';
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  Form,
  Icon,
  Pagination,
  Table,
} from "semantic-ui-react";
import { PaginationProps } from "semantic-ui-react/dist/commonjs/addons/Pagination/Pagination";
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";

import { fetcher } from "../utils/fetcher";

export async function getServerSideProps({ query: { page = "1", order = "title", sort = "asc", priority = "all", status = "all" } }) {
  const {tasks, count} = await fetcher(`/api/task/read?page=${page}&order=${order}&sort=${sort}&priority=${priority}`, null);
  return {
    props: {
      initialTasks: tasks,
      taskCount: count,
      config: {
        page: page,
        order: order,
        sort: sort,
        priority: priority,
        status: status
      }
    },
  };
}

export default function Tasks(props: any) {

  const [firstLoad, setFirstLoad] = useState(true);

  const router = useRouter();
  const [tasks, setTasks] = useState<Prisma.TaskUncheckedCreateInput[]>(props.initialTasks);
  const [config, setConfig] = useState(props.config);
  const [pageCount, setPageCount] = useState(Math.ceil(props.taskCount / 4));


  useEffect(() => {

    if (firstLoad) {
      setFirstLoad(false);
      return;
    } 

    router.query.page = config.page;
    router.query.sort = config.sort;
    router.query.order = config.order;
    router.query.priority = config.priority;
    
    router.push(router);

    const fetchData = async () => {
      const {tasks, count} = await fetcher(`/api/task/read?page=${config.page}&order=${config.order}&sort=${config.sort}&priority=${config.priority}&status=${config.status}`, null);
      setTasks(tasks);
      setPageCount(Math.ceil(count / 4));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const pagginationHandler = (activePage: number) => {
    setConfig({...config, page: activePage})
  };

  const sorting = async (col: string) => {
    const updatedSort = config.sort === "desc" ? "asc" : "desc";
    setConfig({
      ...config,
      sort: updatedSort,
      order: col
    })
  };

  const priorityOptions = [
    { text: "All", value: "all" },
    { text: "Low", value: "1" },
    { text: "Medium", value: "2" },
    { text: "High", value: "3" },
  ];

  const statusOptions = [
    { text: "All", value: "all" },
    { text: "Pending", value: "Pending" },
    { text: "Active", value: "Active" },
    { text: "Completed", value: "Completed" },
  ];

  const filterResults = async (filter: string, value: string) => {
    setConfig({
      ...config,
      [filter]: value,
      page: 1
    });
  }

  return (
    <Container style={{ margin: 20 }}>
      <NextSeo title="Tasks" description="The tasks page" />

      <h1>Tasks</h1>

      <Form>
        <Form.Select
          label="Priority"
          value={config.priority}
          options={priorityOptions}
          onChange={(e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
            filterResults("priority", data.value as string);
          }}
        />
        <Form.Select
          label="Status"
          value={config.status}
          options={statusOptions}
          onChange={(e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
            filterResults("status", data.value as string);
          }}
        />
      </Form>

      <br />


      <Link href="/create-task" passHref>
        <Button>Create Task</Button>
      </Link>
      
      <Table sortable celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={config.order === "title" ? (config.sort === "asc" ? "ascending" : "descending") : undefined}
              onClick={() => sorting("title")}
            >
              Title
            </Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Priority</Table.HeaderCell>
            <Table.HeaderCell
              sorted={config.order === "createdAt" ? (config.sort === "asc" ? "ascending" : "descending") : undefined}
              onClick={() => sorting("createdAt")}
            >Created</Table.HeaderCell>
            <Table.HeaderCell collapsing>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {tasks.map((t, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Link href={`/task/${t.task_id}`}>
                  <a>{t.title}</a>
                </Link>
              </Table.Cell>
              <Table.Cell>{t.description}</Table.Cell>
              <Table.Cell>{t.status}</Table.Cell>
              <Table.Cell>{t.priority}</Table.Cell>
              <Table.Cell>{ format(new Date(t.createdAt as string), 'yyyy-MM-dd') }</Table.Cell>
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
        ellipsisItem={null}
        firstItem={null}
        lastItem={null}
        siblingRange={1}
        totalPages={pageCount}
        activePage={config.page}
        onPageChange={(event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => pagginationHandler(data.activePage as number)}
      />
    </Container>
  );
}
