import React from "react";
import { Session } from "next-auth";
import { useRouter } from "next/router";

import { Container, Spacer, Text } from "@nextui-org/react";
import MessageHeader from "./Messages/Header";
import MessageContent from "./Messages/Content";
import MessageInput from "./Messages/Input";
import NoMessage from "./Messages/NoMessage";

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
        // border: "1px solid green",
        mw: "100%",
        padding: "0px",
        bg: "$accents0",
      }}
    >
      {conversationId && typeof conversationId === "string" ? (
        <Container
          display="flex"
          direction="column"
          justify="space-around"
          css={{
            // border: "1px solid red",
            height: "100%",
            // width: '100%',
            padding: "0",
            overflow: "hidden",
          }}
        >
          <MessageHeader conversationId={conversationId} userId={userId} />
          <div style={{ height: "80%" }}>
            {/* <Spacer y={1} /> */}
            <MessageContent conversationId={conversationId} userId={userId} />
          </div>
          <MessageInput session={session} conversationId={conversationId} />
        </Container>
      ) : (
        <NoMessage />
      )}
    </Container>
  );
};

export default FeedWrapper;
