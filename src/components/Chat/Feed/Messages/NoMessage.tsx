import { Container, Text } from "@nextui-org/react";
import React from "react";

type Props = {};

const NoMessage = (props: Props) => {
  return (
    <Container
      css={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        h3
        // size={'$2xl'}
        // css={{
        //   textGradient: "45deg, $blue600 -20%, $pink600 50%",
        // }}
        weight="bold"
      >
        No messages ✌️
      </Text>
    </Container>
  );
};

export default NoMessage;
