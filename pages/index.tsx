import Head from "next/head";
import { Button, Container, Divider, Form, Header, Icon, Image, Table } from "semantic-ui-react";
import styles from "../styles/Home.module.css";
import pkg from "semantic-ui-react/package.json";
import { Prisma } from "@prisma/client";
import { fetcher } from "../utils/fetcher";
import prisma from "../lib/prisma";
import { useState } from "react";
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { faker } from '@faker-js/faker';


export async function getServerSideProps() {
  const users: Prisma.UserUncheckedCreateInput[] = await prisma.user.findMany();
  return {
    props: { initialUsers: users },
  };
}

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
);

const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const lineLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const lineData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset 1',
      data: lineLabels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: lineLabels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(24, 62, 87)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const pieOptions = [
  { key: "d", text: "DEVELOPER", value: "DEVELOPER" },
  { key: "u", text: "USER", value: "USER" },
  { key: "a", text: "ADMIN", value: "ADMIN" },
];

const pieData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export default function Home({ initialUsers }) {
  const [users, setUsers] = useState<Prisma.UserUncheckedCreateInput[]>(initialUsers);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState();

  const handleChange = (e, { value }) => setRole(value);

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <Container style={{ margin: 20 }}>
        <Header as="h3">This app is powered by NextJS, Semantic UI {pkg.version}</Header>
        <Form
          onSubmit={async () => {
            const body: Prisma.UserCreateInput = {
              firstName,
              lastName,
              role,
              email,
              avatar,
            };

            await fetcher("/api/createUser", { user: body });
            await setUsers([...users, body]);
            setFirstName("");
            setAvatar("");
            setLastName("");
            setRole(null);
            setEmail("");
          }}
        >
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="First Name"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Form.Input
              fluid
              label="Last Name"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Form.Input
              fluid
              label="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Input
              fluid
              label="Avatar"
              placeholder="Avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            <Form.Select
              fluid
              label="Role"
              placeholder="Role"
              pieOptions={pieOptions}
              value={role}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Button>Submit</Form.Button>
        </Form>

        <Divider horizontal>Users</Divider>

        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell collapsing>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {users.map((u, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Header as="h4" image>
                    <Image src={u.avatar} rounded size="mini"></Image>
                    <Header.Content>
                      {u.first_name + " " + u.last_name}
                      <Header.Subheader>{capitalize(u.role)}</Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>{u.email}</Table.Cell>
                <Table.Cell>
                  <Button
                    animated="fade"
                    color="red"
                    onClick={async () => {
                      await fetcher("/api/deleteUser", { user_id: u.user_id });
                      await setUsers(users.filter((usr) => usr !== u));
                    }}
                  >
                    <Button.Content visible>Delete</Button.Content>
                    <Button.Content hidden>
                      <Icon name="user delete" />
                    </Button.Content>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <div style={{width: "300px"}}>
          <Pie data={pieData} />
        </div>
        <div style={{width: "900px"}}>
          <Line options={lineOptions} data={lineData} />
        </div>
      </Container>
    </>
  );
}
