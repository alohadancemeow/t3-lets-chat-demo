import { Container } from "@nextui-org/react";
import { Session } from "next-auth";
import React from "react";

type Props = {
  session: Session;
};

const FeedWrapper = ({ session }: Props) => {
  return (
    <Container
      css={{
        border: "1px solid green",
      }}
    >
      FeedWrapper
    </Container>
  );
};

export default FeedWrapper;
