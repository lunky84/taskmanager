import { fireEvent, render, screen } from "@testing-library/react";
import TaskSearchForm from "./TaskSearchForm";

const config = {
  order: "title",
  sort: "asc",
  search: "",
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

  it("form reset button calls resetForm function", () => {
    const resetForm = jest.fn();
    const component = render(
      <TaskSearchForm resetForm={resetForm} config={config} />
    );

    const button = component.getByTestId("form-reset");

    fireEvent.click(button);

    expect(resetForm).toHaveBeenCalledTimes(1);
  });
});
