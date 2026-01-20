"use client";

import { ForgetPasswordForm } from "./forget-password-form";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

export default function ForgetPasswordPage() {
  return (
    <Card className="flex flex-col items-center p-6 bg-white dark:bg-content1" shadow="none">
      <CardHeader className="flex flex-col gap-2 mb-4 items-start p-0">
        <h1 className="text-4xl font-bold mb-4 text-default-600 p-0">
          Mot de passe oublié
        </h1>
        <p className="text-mute-foreground p-0">
          Veuillez saisir votre adresse email afin de recevoir un lien pour
          ressaisir votre mot de passe.
        </p>
      </CardHeader>
      <CardBody className="overflow-x-hidden p-0 w-full">
        <ForgetPasswordForm />
      </CardBody>
    </Card>
  );
}
