import React from "react";
import { User } from "@prisma/client";

import { User as Profile, Card } from "@nextui-org/react";
import { MdCancel } from "react-icons/md";

type Props = {
  participants: Array<User>;
  removeParticipant: (userId: string) => void;
};

const Participants = ({ participants, removeParticipant }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        margin: "5px",
        gap: "5px",
        flexWrap: "wrap",
      }}
    >
      {participants &&
        participants.map((participant) => (
          <Card
            key={participant.id}
            isHoverable
            isPressable
            variant="flat"
            css={{
              mw: "fit-content",
              bg: "$accents1",
            }}
            onPress={() => removeParticipant(participant.id)}
          >
            <Card.Body>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "-5px 0",
                }}
              >
                <Profile
                  size="xs"
                  src={`${participant.image}`}
                  name={participant.username}
                />
                <MdCancel fill="currentColor" size={20} />
              </div>
            </Card.Body>
          </Card>
        ))}
    </div>
  );
};

export default Participants;
