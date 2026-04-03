import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "../auth/sign-out/sign-out-button";
import { redirect } from "next/navigation";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { UpdateUserForm } from "@/components/update-user-form";
import { ChangePasswordForm } from "@/components/change-password-form";
import { Breadcrumb } from "@/components/breadcrumb";
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

export default async function Page() {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) redirect("/auth/sign-in");

  const FULL_STUDY_PROCESS_ACCESS = await auth.api.userHasPermission({
    headers: headerList,
    body: {
      userId: session.user.id,
      permissions: {
        studyProcesses: ["update", "delete"],
      },
    },
  });

  const CATEGORY_TOPIC_ACCESS = await auth.api.userHasPermission({
    body: {
      role: "admin",
      permissions: {
        categoryTopic: ["create", "update", "delete"],
      },
    },
  });

  const TOPIC_ACCESS = await auth.api.userHasPermission({
    body: {
      role: "admin",
      permissions: {
        topic: ["create", "update", "delete"],
      },
    },
  });

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

      <Breadcrumb steps={[{ label: "Apprentissages" }]} />

      <h1 className="text-3xl font-bold">Mes apprentissages</h1>

      <ListStudiesProgressbar
        userStudies={userStudies}
        categoryTopics={categoryTopics}
        studyProcessAchievedLength={studyProcessesAchieved.length}
      />
    
      {/* <div className="flex items-center gap-2">
        {session.user.role === "ADMIN" && (
          <Button>
            <Link href="/admin/dashboard">Admin Dashboard</Link>
          </Button>
        )}
      </div>

      <div className="space-x-4">
        {TOPIC_ACCESS.success && (
          <Button color="primary">
            <Link href="/topic/list" className="text-white">TOPICS</Link>
          </Button>
        )}

        {CATEGORY_TOPIC_ACCESS.success && (
          <Button color="primary">
            <Link href="/category-topic/list" className="text-white">CATEGORY TOPICS</Link>
          </Button>
        )}

        <Button color="primary" variant="solid">
          MY STUDY PROCESSES
        </Button>

        {FULL_STUDY_PROCESS_ACCESS.success && (
          <Button variant="solid" color="primary">
            ALL STUDY PROCESSES
          </Button>
        )}
      </div> */}
    </div>
  );
}
