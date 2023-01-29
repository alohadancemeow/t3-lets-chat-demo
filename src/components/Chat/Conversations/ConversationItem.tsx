import React from "react";
import { ConversationPopulated } from "./ConversationList";

type Props = {
  userId: string;
  conversation: ConversationPopulated;
  // onClick: () => void;
  // isSelected: boolean;
  // hasSeenLatestMessage: boolean | undefined;
  // onDeleteConversation: (conversationId: string) => void;
};

const ConversationItem = ({ userId, conversation }: Props) => {
  return <div>{conversation.id}</div>;
};

export default ConversationItem;
