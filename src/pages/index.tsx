import { NextPageContext, type NextPage } from "next";
import { getSession, useSession } from "next-auth/react";

import Chat from "../components/Chat";
import Auth from "../components/Auth";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  console.log("HERE IS SESSION", session);

  /**
   * Reload session to obtain new username
   */
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  return (
    <>
      <div>
        {session?.user?.username ? (
          <Chat session={session} />
        ) : (
          <Auth session={session} reloadSession={reloadSession} />
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default Home;
