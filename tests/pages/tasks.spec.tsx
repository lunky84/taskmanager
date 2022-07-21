import Tasks, { getServerSideProps } from "../../pages/tasks";
import { render, screen } from "@testing-library/react";

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

    expect(screen.getByTestId("no-results-message")).toBeInTheDocument();
    expect(screen.getByTestId("no-results-message")).toHaveTextContent(
      "Sorry no results match your search criteria"
    );
  });
});
