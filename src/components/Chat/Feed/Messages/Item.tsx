import React from "react";
import { MessagePopulated } from "types/myTypes";
import { Container, Text, User as Profile } from "@nextui-org/react";

import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";

const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yesterday at' p",
  today: "p",
  other: "MM/dd/yy",
};

type Props = {
  message: MessagePopulated;
  sentByMe: boolean;
};

const Item = ({ message, sentByMe }: Props) => {
  // Format date
  const formatedDate = formatRelative(message.createdAt, new Date(), {
    locale: {
      ...enUS,
      formatRelative: (token) =>
        formatRelativeLocale[token as keyof typeof formatRelativeLocale],
    },
  });

  return (
    <Container
      display="flex"
      justify={sentByMe ? "flex-end" : "flex-start"}
      css={{ padding: "0 14px 0 0", margin: "10px 0" }}
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
            {formatedDate}
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
            wordBreak: "break-all",
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
