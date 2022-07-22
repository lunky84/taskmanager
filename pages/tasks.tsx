import React, { useEffect } from "react";
import { useState } from "react";

import { GetServerSideProps } from "next";
import { Prisma } from "@prisma/client";
import { NextSeo } from "next-seo";
import TaskList from "@/components/Tasks/TaskList";
import TaskSearchForm from "@/components/Tasks/TaskSearchForm";
import { useRouter } from "next/router";
import { Container, Form, Pagination, Grid } from "semantic-ui-react";
import { PaginationProps } from "semantic-ui-react/dist/commonjs/addons/Pagination/Pagination";
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";

import { fetcher } from "../utils/fetcher";

export const getServerSideProps: GetServerSideProps = async ({
  query: {
    page = "1",
    order = "title",
    sort = "asc",
    priority = "all",
    status = "all",
    search = "",
    perPage = "10",
  },
}) => {
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
};

export default function Tasks(props: any) {
  const [firstLoad, setFirstLoad] = useState(true);

  const router = useRouter();
  const [count, setCount] = useState(props.taskCount);
  const [tasks, setTasks] = useState<Prisma.TaskUncheckedCreateInput[]>(
    props.initialTasks
  );
  const [searchTerm, setSearchTerm] = useState(props.config.search);
  const [config, setConfig] = useState(props.config);
  const [pageCount, setPageCount] = useState(
    Math.ceil(props.taskCount / parseInt(props.config.perPage, 10))
  );

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

  const searchTasks = async (search: String) => {
    setConfig({
      ...config,
      order: "title",
      sort: "asc",
      priority: "all",
      status: "all",
      search: search,
      page: 1,
    });
  };

  const deleteTask = async (t: any) => {
    await fetcher("/api/task/delete", { task_id: t.task_id });
    setTasks(tasks.filter((task) => task !== t));
    setCount(count - 1);
  };

  const filterTasks = async (filter: string, value: string) => {
    setConfig({
      ...config,
      [filter]: value,
      page: 1,
    });
  };

  const resetForm = async () => {
    console.log("resetForm called");
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

        <TaskSearchForm
          searchTasks={searchTasks}
          filterTasks={filterTasks}
          resetForm={resetForm}
          config={config}
        ></TaskSearchForm>
      </Container>

      {tasks && tasks.length ? (
        <Container style={{ margin: 20 }}>
          <Grid columns={2} stackable>
            <Grid.Column width={12}>
              <div>
                <strong>Count:</strong>{" "}
                <span data-testid="result-count">{count}</span>
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
        <Container data-testid="no-results-message">
          Sorry no results match your search criteria
        </Container>
      )}
    </div>
  );
}
