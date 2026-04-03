import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "../auth/sign-out/sign-out-button";
import { redirect } from "next/navigation";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { UpdateUserForm } from "@/components/update-user-form";
import { ChangePasswordForm } from "@/components/change-password-form";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { EditIcon } from "@/components/icons";
import StudiesProgressBar from "@/components/list-studies-progress-bar";
import prisma from "../lib/prisma";
import Avatar from "@/components/avatar";
import ListStudiesProgressbar from "@/components/list-studies-progress-bar";
import {
  getCategoryTopicUsedByUser,
  getLastStudySessionByStudyProcess,
  getListCategoryTopic,
  getStudyProcesses,
  getStudyProcessesAchieved,
} from "../actions/actions";
import { Divider } from "@heroui/react";
import MasteryPage from "../mastery/page";

export default async function Page() {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) redirect("/auth/sign-in");

  // const FULL_STUDY_PROCESS_ACCESS = await auth.api.userHasPermission({
  //   headers: headerList,
  //   body: {
  //     userId: session.user.id,
  //     permissions: {
  //       studyProcesses: ["update", "delete"],
  //     },
  //   },
  // });

  // const CATEGORY_TOPIC_ACCESS = await auth.api.userHasPermission({
  //   body: {
  //     role: "admin",
  //     permissions: {
  //       categoryTopic: ["create", "update", "delete"],
  //     },
  //   },
  // });

  // const TOPIC_ACCESS = await auth.api.userHasPermission({
  //   body: {
  //     role: "admin",
  //     permissions: {
  //       topic: ["create", "update", "delete"],
  //     },
  //   },
  // });

  const userStudies = await getStudyProcesses();

  const studyProcessesAchieved = await getStudyProcessesAchieved();

  const categoryTopics = await getCategoryTopicUsedByUser();

  let lastSessionDates = [];

  for (let index = 0; index < studyProcessesAchieved.length; index++) {
    const dateAchieved = await getLastStudySessionByStudyProcess(
      studyProcessesAchieved[index].id
    );
    lastSessionDates.push({
      topic_name: studyProcessesAchieved[index].topic_name,
      date_achieved: dateAchieved,
    });
  }

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
