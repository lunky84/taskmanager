import { FC } from "react";
import TaskForm from "@/components/Tasks/TaskForm";
import { format } from 'date-fns';
import { NextSeo } from "next-seo";
import { Container } from "semantic-ui-react";
import { fetcher } from "../../utils/fetcher";

export const getServerSideProps = async (context: any) => {
  const task = await fetcher(`/api/task/read?task_id=${context.query.task_id}`, null);
  return {
    props: {
      task: task
    },
  };
}

interface props{
  task: {
    task_id: string
    title: string,
    description: string,
    status: string,
    priority: number,
    date_due: Date,
    createdAt: Date,
    updatedAt: Date
  }
}

const TaskPage:FC<props> = (props) => {

  return (
    <>
      <Container style={{ margin: 20 }}>
        <NextSeo title="Task" description="The tasks page" />

        <h1>{props.task.title}</h1>
        <p><strong>ID:</strong> {props.task.task_id}</p>
        <p><strong>Created:</strong> { format(new Date(props.task.createdAt), 'yyyy-MM-dd hh:mm') }</p>
        <p><strong>Modified:</strong> { format(new Date(props.task.updatedAt), 'yyyy-MM-dd hh:mm') }</p>

        <TaskForm task={props.task}></TaskForm>

      </Container>
    </>
  );
}

export default TaskPage;