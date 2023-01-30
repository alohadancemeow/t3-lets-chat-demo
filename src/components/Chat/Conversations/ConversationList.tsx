import React, { useState } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal";

import { MdLogout } from "react-icons/md";
import { BsPatchPlusFill } from "react-icons/bs";
import { Button, Container, Spacer, Text, useModal } from "@nextui-org/react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/router";

type Props = {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLastestMessage: boolean | undefined
  ) => void;
};

const ConversationList = ({
  session,
  conversations,
  onViewConversation,
}: Props) => {
  const { bindings, setVisible } = useModal();

  const router = useRouter();
  const { id: userId } = session.user!!;

  return (
    <Container
      css={{
        // border: "1px solid orange",
        height: "100%",
        margin: "0px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
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

      <div
        style={{
          // border: "1px solid red",
          width: "100%",
          height: "70%",
          gap: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {conversations.length !== 0 ? (
          conversations.map((conversation) => {
            const participant = conversation.participants.find(
              (p) => p.user.id === userId
            );

            return (
              <ConversationItem
                key={conversation.id}
                userId={userId}
                conversation={conversation}
                onViewConversation={onViewConversation}
                isSelected={conversation.id === router.query.conversationId}
                hasSeenLatestMessage={participant?.hasSeenLatestMessage}

                // onDeleteConversation={onDeleteConversation}
              />
            );
          })
        ) : (
          <div
            style={{
              display: "grid",
              margin: "auto",
            }}
          >
            <>
              <Text
                h1
                size={60}
                css={{
                  textGradient: "45deg, $blue600 -20%, $pink600 50%",
                }}
                weight="bold"
              >
                Speak 📢
              </Text>
              <Text
                h1
                size={60}
                css={{
                  textGradient: "45deg, $purple600 -20%, $pink600 100%",
                }}
                weight="bold"
              >
                It
              </Text>
              <Text
                h1
                size={60}
                css={{
                  textGradient: "45deg, $yellow600 -20%, $red600 100%",
                }}
                weight="bold"
              >
                Out! 🎉
              </Text>
            </>
          </div>
        )}
      </div>

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

// types
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
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });
