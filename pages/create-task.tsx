import TaskForm from "@/components/Tasks/TaskForm";
import { NextSeo } from "next-seo";
import { Container } from "semantic-ui-react";

export default function CreateTask() {
    const task = {
        title: "",
        description: "",
        status: "Pending",
        priority: 2,
        date_due: null
    }

  return (
    <>
      <Container style={{ margin: 20 }}>
        <NextSeo title="Task" description="The tasks page" />

        <h1>Create Task</h1>

        <TaskForm task={task}></TaskForm>

      </Container>
    </>
  );
}
