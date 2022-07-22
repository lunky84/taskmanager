import { FC } from "react";
import { Form, Button, Icon } from "semantic-ui-react";
import { useState } from "react";
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";

const TaskSearchForm: FC<any> = ({
  searchTasks,
  filterTasks,
  resetForm,
  updateSearchTerm,
  searchTerm,
  config,
}) => {
  return (
    <>
      <Form
        onSubmit={() => {
          searchTasks(searchTerm);
        }}
      >
        <Form.Group widths="equal">
          <Form.Input
            data-testid="search"
            id="search"
            action={{
              color: "blue",
              icon: "search",
            }}
            label="Search"
            placeholder="Enter a task ID or title"
            value={searchTerm}
            onChange={(e) => updateSearchTerm(e.target.value)}
          />
          <Form.Select
            data-testid="priority"
            id="priority"
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
            data-testid="status"
            id="status"
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
      </Form>

      <Button
        data-testid="form-reset"
        basic
        icon
        labelPosition="left"
        onClick={resetForm}
      >
        <Icon name="refresh" />
        Reset
      </Button>
    </>
  );
};

export default TaskSearchForm;
