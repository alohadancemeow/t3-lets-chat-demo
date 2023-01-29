import React, { useState } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal";

import { MdLogout } from "react-icons/md";
import { BsPatchPlusFill } from "react-icons/bs";
import { Button, Container, Spacer, useModal } from "@nextui-org/react";
import { Prisma } from "@prisma/client";

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    },
    // latestMessage: {
    //   include: {
    //     sender: {
    //       select: {
    //         id: true,
    //         username: true,
    //       },
    //     },
    //   },
    // },
  });

type Props = {
  session: Session;
  conversations: Array<ConversationPopulated>;
};

const ConversationList = ({ session, conversations }: Props) => {
  const { bindings, setVisible } = useModal();

  const { id: userId } = session.user!!;

  return (
    <Container
      css={{
        border: "1px solid orange",
        height: "100%",
        margin: "0px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Spacer y={1} />
        <Button
          size={"lg"}
          icon={<BsPatchPlusFill fill="currentColor" size={24} />}
          color="primary"
          auto
          onPress={() => setVisible(true)}
        >
          Find or start a conversation
        </Button>

        <ConversationModal
          session={session}
          bindings={bindings}
          setVisible={setVisible}
        />
      </div>

      {conversations.map((conversation) => {
        const participant = conversation.participants.find(
          (p) => p.user.id === userId
        );

        return (
          <ConversationItem
            key={conversation.id}
            userId={userId}
            conversation={conversation}

            // onClick={() =>
            //   onViewConversation(
            //     conversation.id,
            //     participant?.hasSeenLatestMessage
            //   )
            // }
            // hasSeenLatestMessage={participant?.hasSeenLatestMessage}
            // isSelected={conversation.id === router.query.conversationId}
            // onDeleteConversation={onDeleteConversation}
          />
        );
      })}

      <div>
        <Spacer y={1} />
        <Button
          iconRight={<MdLogout fill="currentColor" size={24} />}
          color="error"
          auto
          ghost
          onPress={() => signOut()}
        >
          Goodbye 👋
        </Button>
        <Spacer y={2} />
      </div>
    </Container>
  );
};

export default ConversationList;
