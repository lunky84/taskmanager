import React from "react";
import { Button, Container, Divider, Form, Header, Icon, Image, Table } from "semantic-ui-react";
import { NextSeo } from "next-seo";
import { useState } from "react";

export async function getServerSideProps() {
  const users: Prisma.UserUncheckedCreateInput[] = await prisma.user.findMany();
  return {
    props: { initialUsers: users },
  };
}

export default function tasks({ initialUsers }) {
  const [users, setUsers] = useState<Prisma.UserUncheckedCreateInput[]>(initialUsers);

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  return (
    <Container style={{ margin: 20 }}>
      <NextSeo title="Tasks" description="The tasks page" />
      <h1>Tasks</h1>

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
                    {u.firstName + " " + u.lastName}
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
                    await fetcher("/api/deleteUser", { id: u.id });
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
    </Container>
  );
}
