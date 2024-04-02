import { v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    //   get the name and image url passed in from the body of the post request
    const { name, imageUrl } = await req.json();

    // get the current users profile from clerk
    const profile = await currentProfile();

    // if there is no profile (user is not logged in) return unauthorized
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // if the user is logged in create a new server with the data from the post request body
    const server = await db.server.create({
      data: {
        name,
        imageUrl,
        inviteCode: uuidv4(),
        profileId: profile.id,
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });
    return NextResponse.json(server);
  } catch (e) {
    console.log("[SERVERS_POST]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
