import { Redirect } from "expo-router";
import type { ReactNode } from "react";
import { useUser } from "../../hooks/useUser";
import ThemedLoader from "../ThemedLoader";

type GuestOnlyProps = {
  children: ReactNode;
};

const GuestOnly = ({ children }: GuestOnlyProps) => {
  const { authChecked, user } = useUser();

  if (!authChecked) {
    return <ThemedLoader />
  }

  if (user) {
    return <Redirect href="/profile" />;
  }

  return <>{children}</>;
};

export default GuestOnly;
