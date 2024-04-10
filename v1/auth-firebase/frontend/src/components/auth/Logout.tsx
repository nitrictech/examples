import { logOut } from "@/lib/auth";
import { Button } from "../ui/button";

export const Logout = () => {
  return (
    <Button size='lg' variant='secondary' onClick={logOut}>
      Log Out
    </Button>
  );
};
