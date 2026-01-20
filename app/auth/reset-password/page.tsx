"use client";

import { redirect } from "next/navigation";
import { ResetPasswordForm } from "./reset-password-form";
import { Card, CardBody, CardHeader } from "@heroui/react";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = (await searchParams).token;

  if (!token) redirect("/auth/sign-in");

  return (
    // <div className="px-8 container mx-auto max-w-screen-lg space-y-8">
    //   <div className="space-y-8 w-full flex flex-col items-center">
    //     <ReturnButton href="/auth/sign-in" label="Sign In" />

    //     <h1 className="text-2xl font-bold">Réinitialiser votre mot de passe</h1>

    //     <p className="text-mute-foreground">
    //       Merci d'entrer votre nouveau mot de passe.
    //     </p>

    //     <ResetPasswordForm token={token} />
    //   </div>
    // </div>

    <Card className="w-2/3 flex flex-col items-center p-6 border-default-200 bg-white dark:bg-content1" shadow="none">
        <CardHeader className="flex flex-col gap-2 mb-4 items-start">
            <h1 className="text-4xl font-bold mb-4 text-default-600">Réinitialiser votre mot de passe</h1>
            <p className="text-mute-foreground">
              Merci d'entrer votre nouveau mot de passe.
            </p>
        </CardHeader>
        <CardBody>
            <ResetPasswordForm token={token} />
        </CardBody>
    </Card>
  );
}
