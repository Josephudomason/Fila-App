import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import { useUser } from "../../hooks/useUser";
import ThemedLoader from "../ThemedLoader";

type UserOnlyProps = {
  children: ReactNode;
};

const UserOnly = ({ children }: UserOnlyProps) => {
  const { authChecked, user } = useUser();

  if (!authChecked) {
    return <ThemedLoader />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
};

export default UserOnly;
