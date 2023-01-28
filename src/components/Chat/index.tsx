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
    <Grid.Container  justify="center">
      <Grid xs={6}>
        <CovnersationWrapper session={session} />
      </Grid>
      <Grid xs={6}>
        <FeedWrapper session={session} />
      </Grid>
    </Grid.Container>
  );
};

export default Chat;
