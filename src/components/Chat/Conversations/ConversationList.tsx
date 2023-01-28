import React, { useState } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal";

import { MdLogout } from "react-icons/md";
import { BsPatchPlusFill } from "react-icons/bs";
import { Button, Container, Spacer, useModal } from "@nextui-org/react";

type Props = {
  session: Session;
};

const ConversationList = ({ session }: Props) => {
  const { bindings, setVisible } = useModal();

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

      <ConversationItem />

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
