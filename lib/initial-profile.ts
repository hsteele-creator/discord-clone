import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  // try to get the user from clerk
  const user = await currentUser();

  // if there is no user redirect to sign in
  if (!user) {
    return redirectToSignIn();
  }

  // check if there is a profile in the db matching the signed in user
  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  // if there is a profile return it
  if (profile) {
    return profile;
  }

  // if there is no profile in the db create one
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
