import InitialModel from "@/components/modals/Initial-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  // this is the current users profile data
  const profile = await initialProfile();

  // we are going to try to find severs where the user is a member
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // if there is a server that the user is a member of redirect to that server page
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModel />
};

export default SetupPage;
