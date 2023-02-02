import { Text } from "@nextui-org/react";
import React from "react";

type Props = {
  message: string;
};

const Item = ({ message }: Props) => {
  return (
    <>
      <Text size={"$xs"} color="$accents6" weight={"semibold"}>
        3.20 PM
      </Text>
      <Text
        h6
        css={{
          bg: "$primary",
          padding: "5px",
          borderRadius: "10px",
          width: "fit-content",
          height: "auto",
        }}
      >
        {message}
      </Text>
    </>
  );
};

export default Item;
