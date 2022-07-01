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

export async function getServerSideProps({ query: { page = "1", orderBy = "title", sort = "asc", priority = "all" } }) {
  const {tasks, count} = await fetcher(`/api/task/read?page=${page}&orderBy=${orderBy}&sort=${sort}&priority=${priority}`, null);
  return {
    props: {
      initialTasks: tasks,
      taskCount: count,
      currentPage: page,
      orderBy: orderBy,
      sortDirection: sort,
    },
  };
}

export default function Tasks(props: any) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Prisma.TaskUncheckedCreateInput[]>(props.initialTasks);
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(props.currentPage);
  const [order, setOrder] = useState({
    sort: props.sortDirection,
    orderBy: props.orderBy
  });

  const [pageCount, setPageCount] = useState(Math.ceil(props.taskCount / 4));


  useEffect(() => {
    router.query.page = currentPage;
    router.query.sort = order.sort;
    router.query.orderBy = order.orderBy;
    router.query.priority = priority;
    router.push(router);

    const fetchData = async () => {
      const {tasks, count} = await fetcher(`/api/task/read?page=${currentPage}&orderBy=${order.orderBy}&sort=${order.sort}&priority=${priority}`, null);
      setTasks(tasks);
      setPageCount(Math.ceil(count / 4));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, order, priority]);

  const pagginationHandler = (activePage: number) => {
    setCurrentPage(activePage);
  };

  const sorting = async (col: string) => {
    const updatedSort = order.sort === "desc" ? "asc" : "desc";
    setOrder({
      sort: updatedSort,
      orderBy: col
    });
  };

  const priorityOptions = [
    { text: "All", value: "all" },
    { text: "Low", value: "1" },
    { text: "Medium", value: "2" },
    { text: "High", value: "3" },
  ];

  const filterResults = async (newPriority: string) => {
    setPriority(newPriority);
    setCurrentPage(1);
  }

  return (
    <Container style={{ margin: 20 }}>
      <NextSeo title="Tasks" description="The tasks page" />

      <h1>Tasks</h1>

      <Form>
        <Form.Select
          label="Priority"
          value={priority}
          options={priorityOptions}
          onChange={(e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
            filterResults(data.value as string);
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
              sorted={order.orderBy === "title" ? (order.sort === "asc" ? "ascending" : "descending") : undefined}
              onClick={() => sorting("title")}
            >
              Title
            </Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Priority</Table.HeaderCell>
            <Table.HeaderCell
              sorted={order.orderBy === "createAt" ? (order.sort === "asc" ? "ascending" : "descending") : undefined}
              onClick={() => sorting("createAt")}
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
              <Table.Cell>{ format(new Date(t.createAt as string), 'yyyy-MM-dd') }</Table.Cell>
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
        activePage={currentPage}
        onPageChange={(event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => pagginationHandler(data.activePage as number)}
      />
    </Container>
  );
}
