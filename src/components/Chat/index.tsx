import { Container, Grid } from "@nextui-org/react";
import { Session } from "next-auth";
import React from "react";
import CovnersationWrapper from "./Conversations";
import FeedWrapper from "./Feed";

type Props = {
  session: Session;
};

const Chat = ({ session }: Props) => {
  return (
    <Grid.Container justify="center">
      <Grid xs={6} sm={4} md={3}>
        <CovnersationWrapper session={session} />
      </Grid>
      <Grid xs={6} sm={8} md={9}>
        <FeedWrapper session={session} />
      </Grid>
    </Grid.Container>
  );
};

export default Chat;
