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
  const utils = trpc.useContext();

  // Call conversations query
  const {
    data: conversationData,
    error,
    isLoading,
  } = trpc.conversation.conversations.useQuery();
  // console.log("conversation data", conversationData);

  // Call markConversatioAsRead mutation
  const { mutateAsync: markConversationAsReadMutate } =
    trpc.conversation.markConversationAsRead.useMutation({
      onMutate: () => {
        utils.conversation.conversations.cancel();
        const optimisticUpdate = utils.conversation.conversations.getData();
        console.log("onMutate", optimisticUpdate);

        if (optimisticUpdate) {
          utils.conversation.conversations.setData(undefined, optimisticUpdate);
        }
      },
      onSuccess: (data) => {
        console.log("onSuccess markConversatioAsRead", data);
      },
      onSettled: () => {
        utils.conversation.conversations.invalidate();
      },
    });

  // Handle view conversation
  const onViewConversation = async (
    conversationId: string,
    hasSeenLastestMessage: boolean | undefined
  ) => {
    // 1. push the conversationId to the router query params
    router.push({ query: { conversationId } });
    
    // 2. mark the conversation as read
    if (hasSeenLastestMessage) return;
    try {
      await markConversationAsReadMutate({
        userId: session.user?.id!!,
        conversationId,
      });
    } catch (error: any) {
      console.log("onView-markAsRead", error);
    }
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
