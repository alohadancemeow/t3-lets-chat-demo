import React from "react";
import { Container } from "@nextui-org/react";
import MessageItem from "./Item";
import NoMessage from "./NoMessage";

import { api as trpc } from "../../../../utils/api";

type Props = {
  userId: string;
  conversationId: string;
};

const Content = ({ conversationId, userId }: Props) => {
  // get messages
  const { data, error, isLoading } = trpc.message.messages.useQuery({
    conversationId,
  });

  console.log("message data", data);

  return (
    <Container
      css={{
        // border: "1px solid yellow",
        height: "750px",
        overflowY: "auto",
      }}
    >
      {isLoading && <>Loading messages...</>}

      {data && data.length !== 0 ? (
        <>
          {data.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              sentByMe={message.sender.id === userId}
            />
          ))}
        </>
      ) : (
        <NoMessage />
      )}
    </Container>
  );
};

export default Content;
