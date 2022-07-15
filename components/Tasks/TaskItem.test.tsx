import { render } from "@testing-library/react";
import TaskItem from "./TaskItem";

const task = {
  task_id: "1d0dd84f-03ba-43e7-9f49-f2ba3034b7a7",
  title: "alias aut officia consequatur culpa sit repudiandae quia sed at",
  description:
    "Libero debitis rerum ut dicta in voluptatem natus aut dolores. Sint cum molestiae quaerat est ipsam aperiam odio. Dolorem sed nemo quibusdam cum quo culpa. Fuga ea nulla rerum ut. Alias et exercitationem voluptas.",
  author_id: null,
  status: "Active",
  priority: 2,
  date_due: null,
  createdAt: "2022-06-28T16:55:50.107Z",
  updatedAt: "2022-07-14T19:56:59.610Z",
};

let output: any = null;
beforeEach(() => {
  output = render(<TaskItem t={task} />);
});

describe("TaskItem", () => {
  it("uses the task_id in the title link", () => {
    expect(output.getByText(task.title)).toHaveAttribute(
      "href",
      `/task/${task.task_id}`
    );
  });

  it("formats the createdAt date YYYY-MM-DD", () => {
    expect(output.getByText("2022-06-28")).toBeInTheDocument();
  });
});
