import {
  fireEvent,
  render,
  screen,
  within,
  logRoles,
  waitFor,
} from "@testing-library/react";
import TaskSearchForm from "./TaskSearchForm";

const config = {
  order: "title",
  sort: "asc",
  priority: "3", // Medium
  status: "Active",
  search: "search term",
};

describe("TaskSearchForm", () => {
  // Structure tests

  test("search input should be rendered", () => {
    render(<TaskSearchForm config={config} />);
    expect(screen.getByTestId("search")).toBeInTheDocument();
  });

  test("priority select should be rendered", () => {
    render(<TaskSearchForm config={config} />);
    expect(screen.getByTestId("priority")).toBeInTheDocument();
  });

  test("status select should be rendered", () => {
    render(<TaskSearchForm config={config} />);
    expect(screen.getByTestId("status")).toBeInTheDocument();
  });

  test("reset button should be rendered", () => {
    render(<TaskSearchForm config={config} />);
    expect(screen.getByTestId("form-reset")).toBeInTheDocument();
  });

  // Behaviour tests
  test("search input is set to provided searchTerm value", () => {
    render(<TaskSearchForm config={config} />);
    const el = screen.getByTestId("search").children[0];
    expect(el.getAttribute("value")).toEqual(config.search);
  });

  test("priority select is set to provided config value", () => {
    render(<TaskSearchForm config={config} />);
    const el = screen.getByTestId("priority").children[0];
    expect(el.textContent).toEqual("High");
  });

  test("priority select calls filterTasks function", async () => {
    const filterTasks = jest.fn();
    render(<TaskSearchForm filterTasks={filterTasks} config={config} />);
    const dropdownOptions = within(screen.getByTestId("priority")).getAllByRole(
      "option"
    );
    fireEvent.click(dropdownOptions[1]);
    expect(filterTasks).toHaveBeenCalledTimes(1);
  });

  test("status select is set to provided config value", () => {
    render(<TaskSearchForm config={config} />);
    const el = screen.getByTestId("status").children[0];
    expect(el.textContent).toEqual(config.status);
  });

  test("search input should change", async () => {
    render(<TaskSearchForm config={config} updateSearchTerm={jest.fn()} />);
    const el = screen.getByTestId("search").children[0];
    const testValue = "test";
    fireEvent.change(el, { target: { value: testValue } });
    expect(el.getAttribute("value")).toEqual(testValue);
  });

  test("form submit should call searchTasks function with searchTerm argument", () => {
    const searchTasks = jest.fn();
    const { getByTestId } = render(
      <TaskSearchForm searchTasks={searchTasks} config={config} />
    );

    fireEvent.click(getByTestId("search").children[1]);

    expect(searchTasks).toHaveBeenCalledTimes(1);
    expect(searchTasks).toBeCalledWith(config.search);
  });

  test("form reset button calls resetForm function", () => {
    const resetForm = jest.fn();
    const { getByTestId } = render(
      <TaskSearchForm resetForm={resetForm} config={config} />
    );

    fireEvent.click(getByTestId("form-reset"));

    expect(resetForm).toHaveBeenCalledTimes(1);
  });
});
