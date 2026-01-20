"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";

export default function ForgetPasswordSuccessPage() {
    
  return (
        <Card className="w-2/3 flex flex-col items-center p-6 border-default-200 bg-white dark:bg-content1" shadow="none">
          <CardHeader className="flex flex-col gap-2 mb-4">
              <h1 className="text-4xl font-bold mb-4 text-default-600">Réinitialisation de votre mot de passe</h1>
          </CardHeader>
          <CardBody>
                <p className="text-mute-foreground">
                    Nous vous avons renvoyé un lien par email afin que vous puissiez réinitialiser votre mot de passe.
                </p>
          </CardBody>
      </Card>
  );
}
