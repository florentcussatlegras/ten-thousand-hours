"use client";

import { Card, CardBody } from "@heroui/react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import Avatar from "@/components/avatar";
import { EditIcon } from "./icons";

type User = {
  id: string;
  firstname: string;
  name: string;
  email: string;
  image?: string | null;
  role: "admin" | "user";
};

type ProfileUIProps = {
  user: User;
};

export default function ProfileUI({ user }: ProfileUIProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Partie gauche : info user */}
      <div className="lg:col-span-1">
        <Card className="h-full rounded-2xl relative border-none bg-white dark:bg-content1">
          <CardBody className="flex-col items-center justify-center gap-4 my-4">
            {user.image ? (
              <Avatar imgSrc={user.image} />
            ) : (
              <div className="size-26 border-3 border-primary rounded-full bg-sky-500 flex items-center justify-center">
                <span className="uppercase text-lg font-bold">
                  {user.firstname.slice(0, 2)}
                </span>
              </div>
            )}
            <span className="text-xl text-default-600 font-medium">
              {user.firstname} {user.name}
            </span>
            <span className="font-light text-md text-sky-500">{user.email}</span>
            <span className="font-light text-sm text-default-400">
              Développeur Full Stack
            </span>

            <Link href="/settings">
              <EditIcon className="text-default-600" />
            </Link>
          </CardBody>
        </Card>

        {user.role === "admin" && (
          <div className="flex items-center gap-2 mt-4">
            <Button className="bg-sky-500">
              <Link href="/admin/dashboard" className="text-white">
                Admin Dashboard
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Partie droite : Placeholder pour MasteryPage */}
      <div className="lg:col-span-3">
        <Card className="h-full rounded-2xl relative bg-white dark:bg-content1">
          <CardBody className="flex-col items-center justify-center gap-4 my-4">
            {/* MasteryPage reste Server Component dans page.tsx */}
            <span className="text-gray-400">MasteryPage Server Component ici</span>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}