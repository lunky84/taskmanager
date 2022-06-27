import { Container } from "semantic-ui-react";
import { NextSeo } from "next-seo";
import { fetcher } from "../../utils/fetcher";
import TaskForm from "@/components/Tasks/TaskForm";
import { format } from 'date-fns'

export async function getServerSideProps({ query: { task_id } }) {
  const task = await fetcher(`/api/task/read?task_id=${task_id}`, null);
  return {
    props: {
      task: task
    },
  };
}

export default function Task(props) {

  return (
    <>
      <Container style={{ margin: 20 }}>
        <NextSeo title="Task" description="The tasks page" />

        <h1>{props.task.title}</h1>
        <p><strong>ID:</strong> {props.task.task_id}</p>
        <p><strong>Created:</strong> { format(new Date(props.task.createAt), 'yyyy-MM-dd hh:mm') }</p>
        <p><strong>Modified:</strong> { format(new Date(props.task.updatedAt), 'yyyy-MM-dd hh:mm') }</p>

        <TaskForm task={props.task}></TaskForm>

      </Container>
    </>
  );
}
