"use client";

import { Card, CardBody } from "@heroui/react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import Avatar from "@/components/avatar";
import { EditIcon } from "./icons";
import MasteryPage from "@/app/mastery/page";

type User = {
  id: string;
  firstname: string;
  name: string;
  email: string;
  image?: string | null;
  role: "admin" | "user";
};

type ProfileUIProps = {
  session: {
    user: User;
  };
};

export default function ProfileUI({ session }: ProfileUIProps) {
  return (
    <div className="py-8 container mx-auto max-w-[1536px] space-y-8">
      {session.user.role === "admin" && (
        <div className="flex items-center gap-2">
          <Button className="bg-sky-500">
            <Link href="/admin/dashboard" className="text-white">
              Admin Dashboard
            </Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <Card className="h-full rounded-2xl relative border-none bg-white dark:bg-content1">
            <CardBody className="flex-col items-center justify-center gap-4 my-4">
              {session?.user.image ? (
                <Avatar imgSrc={session?.user.image} />
              ) : (
                <div className="size-26 border-3 border-primary rounded-full bg-sky-500 text-primary-foreground flex items-center justify-center">
                  <span className="uppercase text-lg font-bold">
                    {session?.user.firstname.slice(0, 2)}
                  </span>
                </div>
              )}
              <span className="text-xl text-default-600 font-medium">
                {session.user.firstname} {session.user.name}
              </span>
              <span className="font-light text-md text-sky-500">
                {session.user.email}
              </span>
              <span className="font-light text-sm text-default-400">
                Développeur Full Stack
              </span>

              <Link href="/settings">
                <EditIcon className="text-default-600" />
              </Link>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full rounded-2xl relative bg-white dark:bg-content1">
            <CardBody className="flex-col items-center justify-center gap-4 my-4">
              <MasteryPage />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
