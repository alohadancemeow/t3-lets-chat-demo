import React, { useState } from "react";
import { Grid, Input, Loading } from "@nextui-org/react";
import { styled } from "@nextui-org/react";
import { Session } from "next-auth";

import { api as trpc } from "../../../../utils/api";

type Props = {
  session: Session;
  conversationId: string;
};

const MessageInput = ({ session, conversationId }: Props) => {
  const utils = trpc.useContext();

  const [messageBody, setMessageBody] = useState("");

  // call sendMessage
  const { data, error, isLoading, mutateAsync } =
    trpc.message.sendMessage.useMutation({
      onMutate: () => {
        utils.message.messages.cancel();
        const optimisticUpdate = utils.message.messages.getData();

        if (optimisticUpdate) {
          utils.message.messages.setData({ conversationId }, optimisticUpdate);
        }
      },
      onSettled: () => {
        utils.message.messages.invalidate();
        utils.conversation.conversations.invalidate();
      },
      onError: (error) => {
        console.log("onError", error.message);
      },
    });

  // Handle onSendMessage
  const onSendMessage = async () => {
    const { id: userId } = session.user!!;

    try {
      const data = await mutateAsync({
        conversationId,
        senderId: userId,
        body: messageBody,
      });

      if (data) {
        setMessageBody("");
      }
    } catch (error: any) {
      console.log("onSendMessage err", error?.message);
    }
  };

  // subscribe message sent
  trpc.message.messageSent.useSubscription(undefined, {
    onData: (data) => {
      // console.log("onData", data);
      utils.message.messages.invalidate();
      utils.conversation.conversations.invalidate();
    },
  });

  return (
    <Grid.Container gap={4}>
      <Grid style={{ width: "100%" }}>
        <Input
          aria-label="Close"
          width="100%"
          status="primary"
          // css={{ mb: "10px" }}
          size="lg"
          clearable
          contentRightStyling={false}
          placeholder="Type your message..."
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          contentRight={
            <SendButton onClick={onSendMessage}>
              <SendIcon />
            </SendButton>
          }
        />
      </Grid>
    </Grid.Container>
  );
};

export const SendIcon = ({
  fill = "currentColor",
  //   filled,
  size,
  height,
  width,
  label,
  className,
  ...props
}: {
  fill?: string;
  size?: string;
  height?: number | string;
  width?: number | string;
  label?: string;
  className?: string;
}) => {
  return (
    <svg
      data-name="Iconly/Curved/Lock"
      xmlns="http://www.w3.org/2000/svg"
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      <g transform="translate(2 2)">
        <path
          d="M19.435.582A1.933,1.933,0,0,0,17.5.079L1.408,4.76A1.919,1.919,0,0,0,.024,6.281a2.253,2.253,0,0,0,1,2.1L6.06,11.477a1.3,1.3,0,0,0,1.61-.193l5.763-5.8a.734.734,0,0,1,1.06,0,.763.763,0,0,1,0,1.067l-5.773,5.8a1.324,1.324,0,0,0-.193,1.619L11.6,19.054A1.91,1.91,0,0,0,13.263,20a2.078,2.078,0,0,0,.25-.01A1.95,1.95,0,0,0,15.144,18.6L19.916,2.525a1.964,1.964,0,0,0-.48-1.943"
          fill={fill}
        />
      </g>
    </svg>
  );
};

export const SendButton = styled("button", {
  // reset button styles
  background: "transparent",
  border: "none",
  padding: 0,
  // margin: 0,
  // styles
  width: "24px",
  margin: "0 10px",
  dflex: "center",
  bg: "$primary",
  borderRadius: "$rounded",
  cursor: "pointer",
  transition: "opacity 0.25s ease 0s, transform 0.25s ease 0s",
  svg: {
    size: "100%",
    padding: "4px",
    transition: "transform 0.25s ease 0s, opacity 200ms ease-in-out 50ms",
    boxShadow: "0 5px 20px -5px rgba(0, 0, 0, 0.1)",
  },
  "&:hover": {
    opacity: 0.8,
  },
  "&:active": {
    transform: "scale(0.9)",
    svg: {
      transform: "translate(24px, -24px)",
      opacity: 0,
    },
  },
});

export default MessageInput;
