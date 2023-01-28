import React, { useState } from "react";
import { Session } from "next-auth";
import { api as trpc } from "../../../../utils/api";

import { Modal, Button, Text, Input, Spacer } from "@nextui-org/react";
import UserSearchList from "./UserSearchList";
import { User } from "@prisma/client";
import Participants from "./Participants";

type Props = {
  session: Session;
  bindings: {
    open: boolean;
    onClose: () => void;
  };
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConversationModal = ({ session, bindings, setVisible }: Props) => {
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<User>>([]);

  const { data, error, isLoading } = trpc.user.getAllUsers.useQuery();
  //   console.log("getAllUsers", data);

  //   Handle add-remove participants
  const addParticipant = (user: User) => {
    const isExisting = participants.some((p) => p.id === user.id);
    if (!isExisting) {
      setParticipants((prev) => [...prev, user]);
      // setUsername("");
    }
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  //   console.log("participants", participants);

  return (
    <div>
      <Modal
        scroll
        width="500px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" b size={18}>
            Search
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            size="lg"
            placeholder="Paimon"
            aria-label="Close"
            required
            bordered
            color="primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {participants.length !== 0 && (
            <Participants
              participants={participants}
              removeParticipant={removeParticipant}
            />
          )}
          <Spacer y={1} />
          <Button
            auto
            onPress={() => setVisible(false)}
            disabled={participants.length === 0}
          >
            Create a conversation
          </Button>
          <Spacer y={1} />
          {data && (
            <UserSearchList
              users={data}
              addParticipant={addParticipant}
              username={username}
            />
          )}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button auto flat color="error" onPress={() => setVisible(false)}>
            Close
          </Button>
          <Button auto onPress={() => setVisible(false)}>
            Agree
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
};

export default ConversationModal;
