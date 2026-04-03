import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import {
  getLastStudySessionByStudyProcess,
  getStudyProcessesAchieved,
} from "../actions/actions";
import MasteryPage from "../mastery/page";
import ProfileUI from "@/components/profile";

export default async function Page() {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) redirect("/auth/sign-in");

  const studyProcessesAchieved = await getStudyProcessesAchieved();

  let lastSessionDates = [];

  for (let index = 0; index < studyProcessesAchieved.length; index++) {
    const dateAchieved = await getLastStudySessionByStudyProcess(
      studyProcessesAchieved[index].id,
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
          <ProfileUI user={session.user} />
        </div>

        <div className="lg:col-span-3">
          <MasteryPage />
        </div>
      </div>
    </div>
  );
}
