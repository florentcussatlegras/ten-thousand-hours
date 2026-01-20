import * as actions from "@/app/actions/actions";
import StudyProcessCreateForm from "./create-study-process-form";
import { Card, CardBody, CardHeader } from "@heroui/react";

export default async function createStudyProcessPage() {
  const topics: any[] = await actions.getListTopics();

  return <StudyProcessCreateForm topics={topics} />;
}
