import React from "react";
import { Container } from "@nextui-org/react";
import MessageItem from "./Item";

type Props = {};

const Content = (props: Props) => {
  return (
    <Container
      css={{
        // border: "1px solid yellow",
        height: "100%",
      }}
    >
      {Array(10)
        .fill("hello, how are you today ?")
        .map((item, index) => (
          <MessageItem key={index} message={item} />
        ))}
    </Container>
  );
};

export default Content;
