import React from "react";
import ConversationList from "./ConversationList";
import { Session } from "next-auth";
import { Container } from "@nextui-org/react";

type Props = {
  session: Session;
};

const CovnersationWrapper = ({ session }: Props) => {
  return (
    <Container
      css={{
        margin: 0,
        padding: 0,
        height: '100vh'
      }}
    >
      <ConversationList session={session} />
    </Container>
  );
};

export default CovnersationWrapper;
