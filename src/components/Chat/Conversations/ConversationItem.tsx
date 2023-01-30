import React from "react";
import { ConversationPopulated } from "./ConversationList";
import {
  Avatar,
  Card,
  Grid,
  User as Profile,
  Tooltip,
  Text,
} from "@nextui-org/react";

type Props = {
  userId: string;
  conversation: ConversationPopulated;
  // onClick: () => void;
  // isSelected: boolean;
  // hasSeenLatestMessage: boolean | undefined;
  // onDeleteConversation: (conversationId: string) => void;
};

const ConversationItem = ({ userId, conversation }: Props) => {
  return (
    <div>
      <Card
        isPressable
        isHoverable
        variant="shadow"
        css={{
          mw: "100%",
          bg: "$accents1",
        }}
        // onPress={() => addParticipant(user)}
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
                        color="default"
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
