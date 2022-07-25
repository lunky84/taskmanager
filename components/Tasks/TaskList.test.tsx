import { fireEvent, render } from "@testing-library/react";
import TaskList from "./TaskList";

const config = {
  order: "title",
  sort: "asc",
};

describe("TaskList", () => {
  it("sort by title calls function with correct argument", () => {
    const sorting = jest.fn();
    const app = render(
      <TaskList
        onClickSort={sorting}
        onClickDelete={jest.fn()}
        config={config}
        tasks={[]}
      />
    );

    fireEvent.click(app.getByTestId("sort-by-title"));

    expect(sorting).toHaveBeenCalledTimes(1);
    expect(sorting).toBeCalledWith("title");
  });

  it("sort by createdAt calls function with correct argument", () => {
    const sorting = jest.fn();
    const app = render(
      <TaskList
        onClickSort={sorting}
        onClickDelete={jest.fn()}
        config={config}
        tasks={[]}
      />
    );

    fireEvent.click(app.getByTestId("sort-by-createdAt"));

    expect(sorting).toHaveBeenCalledTimes(1);
    expect(sorting).toBeCalledWith("createdAt");
  });

  it("title th has class ascending when order title and sort desc", () => {
    const app = render(
      <TaskList
        onClickSort={jest.fn()}
        onClickDelete={jest.fn()}
        config={config}
        tasks={[]}
      />
    );

    expect(app.getByTestId("sort-by-title")).toHaveClass("ascending");
  });

  it("title th has class descending when order title and sort desc", () => {
    const app = render(
      <TaskList
        onClickSort={jest.fn()}
        onClickDelete={jest.fn()}
        config={{
          order: "title",
          sort: "desc",
        }}
        tasks={[]}
      />
    );

    expect(app.getByTestId("sort-by-title")).toHaveClass("descending");
  });

  it("created th has class ascending when order createdAt and sort asc", () => {
    const app = render(
      <TaskList
        onClickSort={jest.fn()}
        onClickDelete={jest.fn()}
        config={{
          order: "createdAt",
          sort: "asc",
        }}
        tasks={[]}
      />
    );

    expect(app.getByTestId("sort-by-createdAt")).toHaveClass("ascending");
  });

  test("created th has class descending when order createdAt and sort desc", () => {
    const app = render(
      <TaskList
        onClickSort={jest.fn()}
        onClickDelete={jest.fn()}
        config={{
          order: "createdAt",
          sort: "desc",
        }}
        tasks={[]}
      />
    );

    expect(app.getByTestId("sort-by-createdAt")).toHaveClass("descending");
  });
});
