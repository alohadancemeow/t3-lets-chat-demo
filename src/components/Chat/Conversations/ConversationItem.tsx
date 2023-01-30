import React from "react";
import { ConversationPopulated } from "./ConversationList";
import { Avatar, Card, Grid, Tooltip, Text } from "@nextui-org/react";

type Props = {
  userId: string;
  conversation: ConversationPopulated;
  onViewConversation: (
    conversationId: string,
    hasSeenLastestMessage: boolean | undefined
  ) => void;
  isSelected: boolean;
  hasSeenLatestMessage: boolean | undefined;

  // onClick: () => void;
  // onDeleteConversation: (conversationId: string) => void;
};

const ConversationItem = ({
  userId,
  conversation,
  onViewConversation,
  isSelected,
  hasSeenLatestMessage,
}: Props) => {
  return (
    <div>
      <Card
        isPressable
        isHoverable
        variant="shadow"
        css={{
          mw: "100%",
          bg: `${isSelected ? "$accents5" : "$accents1"}`,
        }}
        onPress={() =>
          onViewConversation(
            conversation.id,
            conversation.participants.find((p) => p.user.id === userId)
              ?.hasSeenLatestMessage
          )
        }
      >
        <Card.Body
          css={{
            margin: "-10px 0",
          }}
        >
          <Grid.Container gap={1}>
            <Grid xs={12}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  // border: '1px solid red',
                  width: "100%",
                }}
              >
                <Avatar.Group count={12}>
                  {conversation.participants.map((participant) => (
                    <Tooltip
                      key={participant.id}
                      rounded
                      color="success"
                      content={`${participant.user.username}`}
                    >
                      <Avatar
                        size="md"
                        pointer
                        src={`${participant.user.image}`}
                        bordered
                        color={`${
                          hasSeenLatestMessage ? "default" : "primary"
                        }`}
                        stacked
                      />
                    </Tooltip>
                  ))}
                </Avatar.Group>
                <Text
                  css={{
                    mw: "50%",
                    bg: "$gray500",
                    borderRadius: "10px",
                    padding: "3px 10px",
                  }}
                >
                  Latest message...
                </Text>
              </div>
            </Grid>
          </Grid.Container>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ConversationItem;
