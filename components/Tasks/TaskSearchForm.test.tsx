import { fireEvent, render } from "@testing-library/react";
import TaskSearchForm from "./TaskSearchForm";

const config = {
  order: "title",
  sort: "asc",
  search: "",
};

describe("TaskSearchForm", () => {
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
