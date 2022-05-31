import React from "react";
import { NextSeo } from "next-seo";
import { Container } from "semantic-ui-react";

export default function tasks() {
  return (
    <Container style={{ margin: 20 }}>
      <NextSeo title="Tasks" description="The tasks page" />
      <h1>Tasks</h1>
    </Container>
  );
}
