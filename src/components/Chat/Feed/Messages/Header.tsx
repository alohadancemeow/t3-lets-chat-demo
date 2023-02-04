import React, { useState } from "react";

import { api as trpc } from "../../../../utils/api";
import {
  Badge,
  Button,
  Grid,
  Loading,
  Popover,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import { useRouter } from "next/router";

type Props = {
  userId: string;
  conversationId: string;
};

const Header = ({ conversationId, userId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const utils = trpc.useContext();
  const router = useRouter();

  const { data, isLoading } = trpc.conversation.conversations.useQuery();
  //   console.log('conversation data', data);
  const { isLoading: updateConversationIsLoading, mutateAsync } =
    trpc.conversation.updateConversation.useMutation({
      onMutate: () => {
        utils.conversation.conversations.cancel();
        const optimisticUpdate = utils.conversation.conversations.getData();

        if (optimisticUpdate) {
          utils.conversation.conversations.setData(undefined, optimisticUpdate);
        }
      },
      onError: (error) => {
        console.log("onError", error);
      },
      onSettled: () => {
        utils.conversation.conversations.invalidate();
      },
    });

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

  // Handle leave conversation
  const onLeaveConversation = async () => {
    if (!conversation) return;

    const participantIds = conversation.participants
      .filter((p) => p.user.id !== userId)
      .map((p) => p.user.id);

    console.log("participantIds", participantIds);
    console.log("userId", userId);

    try {
      const data = await mutateAsync({ conversationId, participantIds });

      if (data) {
        setIsOpen(false);
        router.push("/");
      }
    } catch (error: any) {
      console.log("onLeaveConversation error", error);
    }
  };

  // subscribe conversation update
  trpc.conversation.conversationUpdated.useSubscription(undefined, {
    onData: () => {
      utils.conversation.conversations.invalidate();
    },
  });

  return (
    <Grid.Container gap={2} alignItems="baseline">
      <Grid xs={9} alignItems="baseline">
        <Grid>
          <Badge isSquared color="primary" variant="bordered">
            To :
          </Badge>
        </Grid>
        <Grid>
          <Text h6>{usernames}</Text>
        </Grid>
      </Grid>
      <Grid xs>
        <Popover isOpen={isOpen}>
          <Popover.Trigger>
            <Button color="error" auto flat onPress={() => setIsOpen(true)}>
              Leave
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <LeaveDialog
              setIsOpen={setIsOpen}
              onLeaveConversation={onLeaveConversation}
              isLoading={updateConversationIsLoading}
            />
          </Popover.Content>
        </Popover>
      </Grid>
    </Grid.Container>
  );
};

export default Header;

export const LeaveDialog: React.FC<{
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onLeaveConversation: () => void;
  isLoading: boolean;
}> = ({ setIsOpen, onLeaveConversation, isLoading }) => {
  return (
    <Grid.Container
      css={{
        borderRadius: "14px",
        padding: "0.75rem",
        maxWidth: "330px",
        bg: "$accents2",
      }}
    >
      <Row justify="center" align="center">
        <Text b>Are you sure about that huh?</Text>
      </Row>
      <Row>
        <Text color="$accents7">
          Leave this conversation? By doing this, you will not be able to
          recover the data and we are not friends anymore. 😟
        </Text>
      </Row>
      <Spacer y={1} />
      <Grid.Container justify="space-between" alignContent="center">
        <Grid>
          <Button size="sm" light onPress={() => setIsOpen(false)}>
            ehe te nandayo?
          </Button>
        </Grid>
        <Grid>
          <Button
            size="sm"
            shadow
            color="primary"
            onPress={onLeaveConversation}
          >
            {isLoading ? (
              <Loading type="points-opacity" color="currentColor" size="md" />
            ) : (
              "Let me go"
            )}
          </Button>
        </Grid>
      </Grid.Container>
    </Grid.Container>
  );
};
