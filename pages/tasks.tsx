import React, { useEffect } from "react";
import { useState } from "react";

import { Prisma } from "@prisma/client";
import { NextSeo } from "next-seo";
import TaskList from "@/components/Tasks/TaskList";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  Form,
  Icon,
  Pagination,
  Grid,
} from "semantic-ui-react";
import { PaginationProps } from "semantic-ui-react/dist/commonjs/addons/Pagination/Pagination";
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";

import { fetcher } from "../utils/fetcher";

export async function getServerSideProps({
  query: {
    page = "1",
    order = "title",
    sort = "asc",
    priority = "all",
    status = "all",
    search = "",
    perPage = "10",
  },
}) {
  const { tasks, count } = await fetcher(
    `/api/task/read?page=${page}&order=${order}&sort=${sort}&priority=${priority}&search=${search}&perPage=${perPage}`,
    null
  );
  return {
    props: {
      initialTasks: tasks,
      taskCount: count,
      config: {
        page: page,
        order: order,
        sort: sort,
        priority: priority,
        status: status,
        search: search,
        perPage: perPage,
      },
    },
  };
}

export default function Tasks(props: any) {
  const [firstLoad, setFirstLoad] = useState(true);

  const router = useRouter();
  const [count, setCount] = useState(props.taskCount);
  const [tasks, setTasks] = useState<Prisma.TaskUncheckedCreateInput[]>(
    props.initialTasks
  );
  const [config, setConfig] = useState(props.config);
  const [pageCount, setPageCount] = useState(
    Math.ceil(props.taskCount / parseInt(props.config.perPage, 10))
  );
  const [search, setSearch] = useState(props.config.search);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }

    router.query.page = config.page;
    router.query.sort = config.sort;
    router.query.order = config.order;
    router.query.priority = config.priority;
    router.query.search = config.search;
    router.query.perPage = config.perPage;

    router.push(router);

    const fetchData = async () => {
      const { tasks, count } = await fetcher(
        `/api/task/read?page=${config.page}&order=${config.order}&sort=${config.sort}&priority=${config.priority}&status=${config.status}&search=${config.search}&perPage=${config.perPage}`,
        null
      );
      setTasks(tasks);
      setCount(count);
      setPageCount(Math.ceil(count / config.perPage));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const pagginationHandler = (activePage: number) => {
    setConfig({ ...config, page: activePage });
  };

  const sorting = async (col: string) => {
    const updatedSort = config.sort === "desc" ? "asc" : "desc";
    setConfig({
      ...config,
      sort: updatedSort,
      order: col,
    });
  };

  const deleteTask = async (t: any) => {
    await fetcher("/api/task/delete", { task_id: t.task_id });
    setTasks(tasks.filter((task) => task !== t));
    setCount(count - 1);
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
      page: 1,
    });
  };

  const resetForm = async () => {
    setSearch("");
    setConfig({
      ...config,
      page: 1,
      order: "title",
      sort: "asc",
      priority: "all",
      status: "all",
      search: "",
    });
  };

  return (
    <div>
      <Container style={{ margin: 20 }}>
        <NextSeo title="Tasks" description="The tasks page" />

        <h1>Tasks</h1>

        <Form
          onSubmit={async () => {
            setConfig({
              ...config,
              order: "title",
              sort: "asc",
              priority: "all",
              status: "all",
              search: search,
              page: 1,
            });
          }}
        >
          <Form.Group widths="equal">
            <Form.Input
              action={{
                color: "blue",
                icon: "search",
              }}
              label="Search"
              placeholder="Enter a task ID or title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Form.Select
              label="Priority"
              value={config.priority}
              options={priorityOptions}
              onChange={(
                e: React.SyntheticEvent<HTMLElement>,
                data: DropdownProps
              ) => {
                filterResults("priority", data.value as string);
              }}
            />
            <Form.Select
              label="Status"
              value={config.status}
              options={statusOptions}
              onChange={(
                e: React.SyntheticEvent<HTMLElement>,
                data: DropdownProps
              ) => {
                filterResults("status", data.value as string);
              }}
            />
          </Form.Group>
        </Form>

        <Button basic icon labelPosition="left" onClick={resetForm}>
          <Icon name="refresh" />
          Reset
        </Button>
      </Container>

      {tasks && tasks.length ? (
        <Container style={{ margin: 20 }}>
          <Grid columns={2} stackable>
            <Grid.Column width={12}>
              <div>
                <strong>Count:</strong> {count}
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <Form>
                <Form.Select
                  label="Results per page"
                  value={config.perPage}
                  options={[
                    { text: "5", value: "5" },
                    { text: "10", value: "10" },
                    { text: "25", value: "25" },
                    { text: "50", value: "50" },
                    { text: "100", value: "100" },
                  ]}
                  onChange={(
                    e: React.SyntheticEvent<HTMLElement>,
                    data: DropdownProps
                  ) => {
                    setConfig({
                      ...config,
                      perPage: data.value,
                      page: 1,
                    });
                  }}
                />
              </Form>
            </Grid.Column>
          </Grid>

          <TaskList
            onClickSort={sorting}
            onClickDelete={deleteTask}
            config={config}
            tasks={tasks}
          ></TaskList>

          <Pagination
            boundaryRange={0}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={pageCount}
            activePage={config.page}
            onPageChange={(
              event: React.MouseEvent<HTMLAnchorElement>,
              data: PaginationProps
            ) => pagginationHandler(data.activePage as number)}
          />
        </Container>
      ) : (
        <Container>Sorry no results match your search criteria</Container>
      )}
    </div>
  );
}
