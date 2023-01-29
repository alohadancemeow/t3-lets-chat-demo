import React, { useState } from "react";
import { Session } from "next-auth";
import { api as trpc } from "../../../../utils/api";

import { Modal, Button, Text, Input, Spacer, Loading } from "@nextui-org/react";
import UserSearchList from "./UserSearchList";
import { User } from "@prisma/client";
import Participants from "./Participants";
import { useRouter } from "next/router";

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

  const router = useRouter();
  const utils = trpc.useContext();

  // get all users
  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = trpc.user.getAllUsers.useQuery();

  // call create conversation mutation
  const {
    data: conversationData,
    error: conversationError,
    isLoading: conversationIsLoading,
    mutateAsync,
    mutate,
  } = trpc.conversation.createConversation.useMutation({
    onMutate: () => {
      utils.conversation.conversations.cancel();
      const optimiscUpdate = utils.conversation.conversations.getData();
      console.log("onMutate", optimiscUpdate);

      if (optimiscUpdate) {
        utils.conversation.conversations.setData(undefined, optimiscUpdate);
      }
    },
    onError: (error) => {
      console.log("onError", error.data);
    },
    onSettled: () => {
      utils.conversation.conversations.invalidate();
    },
    onSuccess: ({ conversationId }) => {
      console.log("onSuccess conversationId", conversationId);
    },
  });

  // console.log("conversationData", conversationData);
  // console.log("conversationError", conversationError);

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
  // console.log("participants", participants);

  // Handle create conversation
  const onCreateConversation = async () => {
    const participantIds = [
      session.user?.id!!,
      ...participants.map((p) => p.id),
    ];

    try {
      const { conversationId } = await mutateAsync({ participantIds });
      console.log("conversationId", conversationId);

      if (!conversationId) {
        throw new Error("Failed t ocreate conversation");
      }

      // Push to conversation room
      router.push({ query: { conversationId } });

      // Clear state and close modal on successful creation
      setParticipants([]);
      setUsername("");
      setVisible(false);
    } catch (error: any) {
      console.log("onCreateConversation err", error);
    }
  };

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
            onPress={onCreateConversation}
            disabled={participants.length === 0}
          >
            {conversationIsLoading ? (
              <Loading type="points-opacity" color="currentColor" size="sm" />
            ) : (
              <>Create a conversation</>
            )}
          </Button>
          <Spacer y={1} />
          {userData && (
            <UserSearchList
              users={userData}
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
