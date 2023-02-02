import React from "react";

import { api as trpc } from "../../../../utils/api";
import { Badge, Grid, Text } from "@nextui-org/react";

type Props = {
  userId: string;
  conversationId: string;
};

const Header = ({ conversationId, userId }: Props) => {
  const { data, isLoading } = trpc.conversation.conversations.useQuery();
  //   console.log('conversation data', data);

  const conversation = data?.find((c) => c.id === conversationId);

  /**  Filtering out the current user from the list of participants
   *   and then mapping over the remaining
   *   participants to get their usernames.
   */

  const usernames =
    conversation &&
    conversation.participants
      .filter((participant) => participant.user.id !== userId)
      .map((participant) => participant.user.username)
      .join(", ");

  return (
    <Grid.Container gap={2} alignItems="baseline">
      <Grid>
        <Badge isSquared color="primary" variant="bordered">
          To :
        </Badge>
      </Grid>
      <Grid>
        <Text h6>{usernames}</Text>
      </Grid>
    </Grid.Container>
  );
};

export default Header;
