import { getServerSideProps } from "../../pages/tasks";

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
});
