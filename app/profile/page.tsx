import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  getCategoryTopicUsedByUser,
  getLastStudySessionByStudyProcess,
  getStudyProcesses,
  getStudyProcessesAchieved,
} from "../actions/actions";
import ProfileUI from "@/components/profile";

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
    <ProfileUI session={session} />
  );
}
