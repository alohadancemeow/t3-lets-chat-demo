import React from "react";
import { MessagePopulated } from "types/myTypes";
import { Container, Text, User as Profile } from "@nextui-org/react";

type Props = {
  message: MessagePopulated;
  sentByMe: boolean;
};

const Item = ({ message, sentByMe }: Props) => {
  return (
    <Container
      display="flex"
      justify={sentByMe ? "flex-end" : "flex-start"}
      css={{ padding: "0px", margin: "10px 0" }}
      // gap={5}
    >
      <div>
        <div
          style={{
            display: "flex",
            marginBottom: "8px",
            justifyContent: `${sentByMe ? "flex-end" : "flex-start"}`,
          }}
        >
          {!sentByMe && (
            <Profile
              src={`${message.sender.image}`}
              name={`${message.sender.username}`}
              size="sm"
              css={{ paddingInlineStart: "0px" }}
            />
          )}
          <Text size={"$xs"} color="$accents6" weight={"semibold"}>
            3.20 PM
          </Text>
        </div>

        <Text
          h6
          css={{
            bg: `${sentByMe ? "$primary" : "$accents6"}`,
            padding: "5px",
            borderRadius: "10px",
            width: "fit-content",
            height: "auto",
            wordBreak: 'break-all',
            justifyContent: `${sentByMe ? "flex-end" : "flex-start"}`,
          }}
        >
          {message.body}
        </Text>
      </div>
    </Container>
  );
};

export default Item;
