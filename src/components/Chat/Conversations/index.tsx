import React from "react";
import { api as trpc } from "../../../utils/api";

import ConversationList from "./ConversationList";
import { Session } from "next-auth";
import { Container } from "@nextui-org/react";

type Props = {
  session: Session;
};

const CovnersationWrapper = ({ session }: Props) => {
  // Call conversations query
  const { data: conversationData, error, isLoading } = trpc.conversation.conversations.useQuery();
  console.log("conversation data", conversationData);

  return (
    <Container
      css={{
        margin: 0,
        padding: 0,
        height: "100vh",
      }}
    >
      <ConversationList
        session={session}
        conversations={conversationData || []}
      />
    </Container>
  );
};

export default CovnersationWrapper;
