"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import SignUpForm from "./signup-form";
import { SignInOauthButton } from "@/components/sign-in-oauth-button";

export default function SignUpPage() {

  return (
        <Card className="flex flex-col items-center py-6 border-default-200 w-full md:w-2/3 border bg-white dark:bg-content1" shadow="none">
          <CardHeader className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold mb-4 text-default-600">Inscription</h1>
              <div className="flex max-w-full gap-6 items-center">
                <SignInOauthButton provider="google" />
                <SignInOauthButton provider="github" />
              </div>
              {/* <Divider className="mt-6" /> */}
          </CardHeader>
          <CardBody>
              <SignUpForm />
          </CardBody>
      </Card>
  );
}