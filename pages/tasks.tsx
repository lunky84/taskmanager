import React, { useEffect } from "react";
import {
  Button,
  Container,
  Divider,
  Form,
  Header,
  Icon,
  Image,
  Table,
  Pagination,
} from "semantic-ui-react";
import { NextSeo } from "next-seo";
import { useState } from "react";
import { Prisma } from "@prisma/client";
import { fetcher } from "../utils/fetcher";
import prisma from "../lib/prisma";
import { useRouter } from "next/router";
import Link from "next/link";
import { format } from 'date-fns'

export async function getServerSideProps({ query: { page = "1", orderBy = "title", sort = "asc", priority = "all" } }) {
  const tasks = await fetcher(`/api/task/read?page=${page}&orderBy=${orderBy}&sort=${sort}&priority=${priority}`, null);
  const count = await prisma.task.count();
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
  const [sort, setSort] = useState(props.sortDirection);
  const [orderBy, setOrderBy] = useState(props.orderBy);
  const [currentDate, setNewDate] = useState(null);




  useEffect(() => {
    console.log("currentPage = " + currentPage);
    console.log("sort = " + sort);
    console.log("orderBy = " + orderBy);
    console.log("priority = " + priority);

    router.query.page = currentPage;
    router.query.sort = sort;
    router.query.orderBy = orderBy;
    router.query.priority = priority;
    router.push(router);

    const fetchData = async () => {
      setTasks(await fetcher(`/api/task/read?page=${currentPage}&orderBy=${orderBy}&sort=${sort}&priority=${priority}`, null));
    };

    fetchData();    
  }, [currentPage, sort, orderBy, priority]);

  const pagginationHandler = (activePage: number) => {
    setCurrentPage(activePage);
  };

  const pageCount: number = Math.ceil(props.taskCount / 4);

  const sorting = async (col: string) => {
    const updatedSort = sort === "desc" ? "asc" : "desc";
    setOrderBy(col);
    setSort(updatedSort);
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


      <Form.Select
        label="Priority"
        value={priority}
        options={priorityOptions}
        onChange={(e, data) => {
          filterResults(data.value);
        }}
      />


      <Link href="/create-task" passHref>
        <Button>Create Task</Button>
      </Link>
      
      <Table sortable celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={orderBy === "title" ? (sort === "asc" ? "ascending" : "descending") : null}
              onClick={() => sorting("title")}
            >
              Title
            </Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Priority</Table.HeaderCell>
            <Table.HeaderCell
              sorted={orderBy === "createAt" ? (sort === "asc" ? "ascending" : "descending") : null}
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
              <Table.Cell>{ format(new Date(t.createAt), 'yyyy-MM-dd') }</Table.Cell>
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
        onPageChange={(event, data) => pagginationHandler(data.activePage)}
      />
    </Container>
  );
}
