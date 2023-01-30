import React from "react";
import { Session } from "next-auth";
import { useRouter } from "next/router";

import { Container, Text } from "@nextui-org/react";

type Props = {
  session: Session;
};

const FeedWrapper = ({ session }: Props) => {
  const router = useRouter();
  const { conversationId } = router.query;
  const { id: userId } = session.user!!;

  return (
    <Container
      css={{
        border: "1px solid green",
      }}
    >
      {conversationId ? <div>{conversationId}</div> : <NoMessage />}
    </Container>
  );
};

export default FeedWrapper;

// NoMessage conponents
export const NoMessage = () => (
  <Container
    css={{
      display: "flex",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text
      h3
      // size={'$2xl'}
      // css={{
      //   textGradient: "45deg, $blue600 -20%, $pink600 50%",
      // }}
      weight="bold"
    >
      No messages ✌️
    </Text>
  </Container>
);
