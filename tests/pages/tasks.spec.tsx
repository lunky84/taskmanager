import Tasks, { getServerSideProps } from "../../pages/tasks";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { faker } from "@faker-js/faker";

describe("The tasks page", () => {
  const { tasks, count } = { tasks: [], count: 0 };

  window.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          tasks: tasks,
          count: count,
        }),
    })
  );

  const statuses = ["Pending", "Active", "Complete"];

  const randomStatus = () => {
    return faker.datatype.number({
      min: 0,
      max: statuses.length - 1,
    });
  };

  const mockTask = (n = 1) => {
    const tasks = [];

    for (let i = 0; i < n; i++) {
      tasks.push({
        task_id: faker.datatype.uuid(),
        title: faker.lorem.words(10),
        description: faker.lorem.paragraph(3),
        author_id: null,
        status: statuses[randomStatus()],
        priority: faker.datatype.number({
          min: 1,
          max: 3,
        }),
        date_due: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      });
    }

    return tasks;
  };

  it("should call task read api and return prop defaults", async () => {
    const response = await getServerSideProps({
      query: {},
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          initialTasks: tasks,
          taskCount: count,
          config: {
            page: "1",
            order: "title",
            sort: "asc",
            priority: "all",
            status: "all",
            search: "",
            perPage: "10",
          },
        },
      })
    );
  });

  it("Should display message when no tasks", async () => {
    const props = {
      initialTasks: tasks,
      taskCount: count,
      config: {
        page: "1",
        order: "title",
        sort: "asc",
        priority: "all",
        status: "all",
        search: "",
        perPage: "10",
      },
    };

    render(<Tasks {...props} />);

    const noResultsMessage = screen.getByTestId("no-results-message");
    expect(noResultsMessage).toBeInTheDocument();
    expect(noResultsMessage).toHaveTextContent(
      "Sorry no results match your search criteria"
    );
  });

  it("Should display results", async () => {
    const props = {
      initialTasks: mockTask(),
      taskCount: 1,
      config: {
        page: "1",
        order: "title",
        sort: "asc",
        priority: "all",
        status: "all",
        search: "",
        perPage: "10",
      },
    };

    render(<Tasks {...props} />);

    expect(screen.queryByTestId("no-results-message")).toBeNull();

    const resultCount = screen.getByTestId("result-count");
    expect(resultCount).toBeInTheDocument();
    expect(resultCount).toHaveTextContent(props.taskCount.toString());

    expect(screen.queryAllByRole("row")).toHaveLength(
      props.initialTasks.length + 1
    );
  });

  it("Should delete task", async () => {
    const props = {
      initialTasks: mockTask(2),
      taskCount: 2,
      config: {
        page: "1",
        order: "title",
        sort: "asc",
        priority: "all",
        status: "all",
        search: "",
        perPage: "10",
      },
    };

    render(<Tasks {...props} />);

    const firstDeleteButton =
      screen.getAllByTestId("delete-task")[0].children[0];

    const resultCount = screen.getByTestId("result-count");
    expect(resultCount).toBeInTheDocument();
    expect(resultCount).toHaveTextContent(props.taskCount.toString());
    expect(screen.queryAllByRole("row")).toHaveLength(
      props.initialTasks.length + 1
    );

    await act(async () => {
      fireEvent.click(firstDeleteButton);
    });

    expect(resultCount).toHaveTextContent((props.taskCount - 1).toString());
    expect(screen.queryAllByRole("row")).toHaveLength(
      props.initialTasks.length
    );
  });
});
