import { FC } from "react";
import { Form, Button, Icon } from "semantic-ui-react";
import { useState } from "react";
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";

const TaskSearchForm: FC<any> = ({
  searchTasks,
  filterTasks,
  resetForm,
  config,
}) => {
  const [search, setSearch] = useState(config.search);

  return (
    <Form
      onSubmit={() => {
        searchTasks(search);
      }}
    >
      <Form.Group widths="equal">
        <Form.Input
          action={{
            color: "blue",
            icon: "search",
          }}
          label="Search"
          placeholder="Enter a task ID or title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Form.Select
          label="Priority"
          value={config.priority}
          options={[
            { text: "All", value: "all" },
            { text: "Low", value: "1" },
            { text: "Medium", value: "2" },
            { text: "High", value: "3" },
          ]}
          onChange={(
            e: React.SyntheticEvent<HTMLElement>,
            data: DropdownProps
          ) => {
            filterTasks("priority", data.value as string);
          }}
        />
        <Form.Select
          label="Status"
          value={config.status}
          options={[
            { text: "All", value: "all" },
            { text: "Pending", value: "Pending" },
            { text: "Active", value: "Active" },
            { text: "Completed", value: "Completed" },
          ]}
          onChange={(
            e: React.SyntheticEvent<HTMLElement>,
            data: DropdownProps
          ) => {
            filterTasks("status", data.value as string);
          }}
        />
      </Form.Group>

      <Button
        basic
        icon
        labelPosition="left"
        onClick={() => {
          setSearch("");
          resetForm;
        }}
      >
        <Icon name="refresh" />
        Reset
      </Button>
    </Form>
  );
};

export default TaskSearchForm;
