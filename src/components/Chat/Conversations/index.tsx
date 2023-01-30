import React from "react";
import { api as trpc } from "../../../utils/api";

import ConversationList from "./ConversationList";
import { Session } from "next-auth";
import { Container } from "@nextui-org/react";
import { useRouter } from "next/router";

type Props = {
  session: Session;
};

const CovnersationWrapper = ({ session }: Props) => {
  const router = useRouter();

  // Call conversations query
  const {
    data: conversationData,
    error,
    isLoading,
  } = trpc.conversation.conversations.useQuery();
  // console.log("conversation data", conversationData);

  // Handle view conversation
  const onViewConversation = async (
    conversationId: string,
    hasSeenLastestMessage: boolean | undefined
  ) => {
    // 1. push the conversationId to the router query params
    router.push({ query: { conversationId } });
    // 2. mark the conversation as read
    if (hasSeenLastestMessage) return;

    // markConversationAsRead mutation
  };

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
        onViewConversation={onViewConversation}
      />
    </Container>
  );
};

export default CovnersationWrapper;
