import { Session } from "next-auth";
import React from "react";

type Props = {
  session: Session | null;
  reloadSession: () => void;
};

const Auth = ({ session, reloadSession }: Props) => {
  return <div>Auth</div>;
};

export default Auth;
