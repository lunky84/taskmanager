import Head from "next/head";
import { Container, Form, Header } from "semantic-ui-react";
import styles from "../styles/Home.module.css";
import pkg from "semantic-ui-react/package.json";
import { Prisma } from "@prisma/client";
import { fetcher } from "../utils/fetcher";
import prisma from "../lib/prisma";
import { useState } from "react";

export async function getServerSideProps() {
  const users: Prisma.UserUncheckedCreateInput[] = await prisma.user.findMany();
  return {
    props: { initialUsers: users },
  };
}

const options = [
  { key: "d", text: "DEVELOPER", value: "DEVELOPER" },
  { key: "u", text: "USER", value: "USER" },
  { key: "a", text: "ADMIN", value: "ADMIN" },
];

export default function Home({ initialUsers }) {
  const [users, setUsers] = useState<Prisma.UserUncheckedCreateInput[]>(initialUsers);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("");

  const handleChange = (e, { value }) => setRole(value);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
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

            await fetcher("/api/create", { user: body });
            await setUsers([...users, body]);
            setFirstName("");
            setLastName("");
            setRole(null);
            setEmail("");
            setAvatar("");
          }}
        ></Form>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="First Name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <br />
          <Form.Input
            fluid
            label="Last Name"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <br />
          <Form.Input
            fluid
            label="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <Form.Input
            fluid
            label="Avatar"
            placeholder="Avatar"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
          <br />
          <Form.Select
            fluid
            label="Role"
            placeholder="Role"
            options={options}
            value={role}
            onChange={handleChange}
          />
        </Form.Group>
        <br />
        <Form.Button>Submit</Form.Button>
      </Container>
    </>
  );
}
