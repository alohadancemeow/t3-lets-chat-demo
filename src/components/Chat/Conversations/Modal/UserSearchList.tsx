import React from "react";
import { User } from "@prisma/client";

import { Card, Text, User as Profile } from "@nextui-org/react";

type Props = {
  users: Array<User>;
  addParticipant: (user: User) => void;
  username: string;
};

const UserSearchList = ({ users, addParticipant, username }: Props) => {
  const filteredUsers =
    users.filter((p) => p.username?.toLowerCase().includes(username)) ?? users;
  // console.log("filteredUsers", filteredUsers);

  return (
    <div>
      {filteredUsers.length === 0 ? (
        <Text>No users :ehe ✌️</Text>
      ) : (
        filteredUsers.map((user) => (
          <Card
            key={user.id}
            isPressable
            isHoverable
            // variant="shadow"
            css={
              {
                // mw: "400px",
                // bg: "$accents1",
              }
            }
            onPress={() => addParticipant(user)}
          >
            <Card.Body>
              <Profile
                src={`${user.image}`}
                name={user.username}
                description={`${user.name}`}
              />
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default UserSearchList;
