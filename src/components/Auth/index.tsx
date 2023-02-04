import React, { useState } from "react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";

import {
  Container,
  Card,
  Row,
  Text,
  Button,
  Spacer,
  Input,
  Avatar,
  Loading,
} from "@nextui-org/react";
import { AiFillGoogleCircle, AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { BsFacebook, BsFillArrowRightCircleFill } from "react-icons/bs";

import { api as trpc } from "../../utils/api";

type Props = {
  session: Session | null;
  reloadSession: () => void;
};

const Auth = ({ session, reloadSession }: Props) => {
  const utils = trpc.useContext();

  const [username, setUsername] = useState("");

  const { mutateAsync, data, error, isLoading } =
    trpc.user.createUsername.useMutation({
      onMutate: () => {
        utils.user.getAllUsers.cancel();
        const optimisticUpdate = utils.user.getAllUsers.getData();

        if (optimisticUpdate) {
          utils.user.getAllUsers.setData(undefined, optimisticUpdate);
        }
      },
      onSuccess: (data) => {
        console.log("onSuccess", data);
        // reloadSession();
      },
      onError: (error) => {
        console.log("onError", error.message);
      },
      onSettled: () => {
        utils.user.getAllUsers.invalidate();
      },
    });

  // Handle submit
  const handleSubmit = async () => {
    if (!username) return;

    try {
      // mutate({ username });
      const { success, error } = await mutateAsync({ username });
      if (success) reloadSession();
      if (error) console.log(error);

      setUsername("");
    } catch (error: any) {
      console.log("handleSunmit", error?.message);
    }
  };

  return (
    <Container
      fluid
      display="flex"
      justify="center"
      alignItems="center"
      alignContent="center"
      css={{
        height: "100vh",
        // bg: '$accents1'
        // border: "1px solid red",
      }}
    >
      {session ? (
        <Card css={{ width: "350px", padding: "20px" }}>
          <Card.Body>
            <Row justify="center" align="center">
              <Text h2 size={18} color="white" css={{ m: 0 }}>
                👋 Create username 🎉
              </Text>
            </Row>
            <Spacer y={2} />
            <Input
              size="xl"
              aria-label="Close"
              required
              bordered
              color="primary"
              placeholder="alohadancemeow"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              contentLeft={
                <Avatar
                  // src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  src={session?.user && `${session.user.image}`}
                  size="sm"
                />
              }
            />
            <Spacer y={1} />
            <Button
              iconRight={
                <BsFillArrowRightCircleFill fill="currentColor" size={24} />
              }
              color="success"
              flat
              disabled={username.length === 0 ? true : false}
              onPress={handleSubmit}
            >
              {isLoading ? (
                <Loading type="points-opacity" color="currentColor" size="md" />
              ) : (
                "Next"
              )}
            </Button>
            <Spacer y={1} />
          </Card.Body>
        </Card>
      ) : (
        <Card css={{ width: "350px", padding: "20px", bg: "$accents1" }}>
          <Card.Body>
            <Row justify="center" align="center">
              <Text h2 size={18} color="white" css={{ m: 0 }}>
                👋 Let's chat 🎉
              </Text>
            </Row>
            <Spacer y={2} />
            <Button
              icon={<AiFillGoogleCircle fill="currentColor" size={24} />}
              color="error"
              flat
              onClick={() => signIn("google")}
            >
              Continue with Google
            </Button>
            <Spacer y={1} />
            <Button
              icon={<BsFacebook fill="currentColor" size={24} />}
              color="primary"
              flat
            >
              Continue with Facebook
            </Button>
            <Spacer y={1} />
            <Button
              icon={<FaDiscord fill="currentColor" size={24} />}
              color="secondary"
              flat
            >
              Continue with Discord
            </Button>
            <Spacer y={1} />
            <Button
              icon={<AiFillGithub fill="currentColor" size={24} />}
              color="success"
              flat
            >
              Continue with Github
            </Button>
            <Spacer y={1} />
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Auth;
