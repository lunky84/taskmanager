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

    const noResultsMessage = screen.getByTestId("no-results-message");
    expect(noResultsMessage).toBeInTheDocument();
    expect(noResultsMessage).toHaveTextContent(
      "Sorry no results match your search criteria"
    );
  });

  it("Should display results", async () => {
    const props = {
      initialTasks: [
        {
          task_id: "1d0dd84f-03ba-43e7-9f49-f2ba3034b7a7",
          title:
            "alias aut officia consequatur culpa sit repudiandae quia sed at",
          description:
            "Libero debitis rerum ut dicta in voluptatem natus aut dolores. Sint cum molestiae quaerat est ipsam aperiam odio. Dolorem sed nemo quibusdam cum quo culpa. Fuga ea nulla rerum ut. Alias et exercitationem voluptas.",
          author_id: null,
          status: "Active",
          priority: 2,
          date_due: null,
          createdAt: "2022-06-28T16:55:50.107Z",
          updatedAt: "2022-07-14T19:56:59.610Z",
        },
      ],
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

    screen.debug();

    expect(screen.queryByTestId("no-results-message")).toBeNull();

    const resultCount = screen.getByTestId("result-count");
    expect(resultCount).toBeInTheDocument();
    expect(resultCount).toHaveTextContent(props.taskCount.toString());

    expect(screen.queryAllByRole("row")).toHaveLength(
      props.initialTasks.length + 1
    );
  });
});
