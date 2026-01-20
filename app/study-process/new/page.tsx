import * as actions from "@/app/actions/actions";
import StudyProcessCreateForm from "./create-study-process-form";
import { Card, CardBody, CardHeader } from "@heroui/react";

export default async function createStudyProcessPage() {
  const topics: any[] = await actions.getListTopics();

  return (
    <Card className="flex flex-col items-center p-6 bg-white dark:bg-content1" shadow="none">
      <CardHeader className="flex flex-col gap-2 mb-4 items-start p-0">
        <h1 className="text-4xl font-bold mb-4 text-default-600 p-0">
          Nouvel Apprentissage
        </h1>
        <p className="text-mute-foreground p-0">
          Créer un nouvel apprentissage auquelle vous rajouterez des sessions de travail
        </p>
      </CardHeader>
      <CardBody className="overflow-x-hidden p-0 w-full">
        <StudyProcessCreateForm topics={topics} />
      </CardBody>
    </Card>
  );
}
