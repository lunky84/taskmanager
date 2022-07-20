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
      <TaskList onClickSort={sorting} config={config} tasks={[]} />
    );

    const th = app.getByTestId("sort-by-title");

    fireEvent.click(th);

    expect(sorting).toHaveBeenCalledTimes(1);
    expect(sorting).toBeCalledWith("title");
  });

  it("sort by createdAt calls function with correct argument", () => {
    const sorting = jest.fn();
    const app = render(
      <TaskList onClickSort={sorting} config={config} tasks={[]} />
    );

    const th = app.getByTestId("sort-by-createdAt");

    fireEvent.click(th);

    expect(sorting).toHaveBeenCalledTimes(1);
    expect(sorting).toBeCalledWith("createdAt");
  });
});
