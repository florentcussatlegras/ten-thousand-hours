"use client";

import { createStudySessionAction } from "@/app/actions/create-study-session.action";
import {
  Button,
  Card,
  CardBody,
  DatePicker,
  Form,
  Input,
  Textarea,
  TimeInput,
} from "@heroui/react";
import { Time } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { StudyProcess } from "@prisma/client";
import { LinkIcon, PlusIcon } from "lucide-react";
import { useActionState, useState, useEffect } from "react";
import { DeleteIcon } from "./icons";

function roundToFiveMinutes(date: Date) {
  const ms = 1000 * 60 * 5;
  return new Date(Math.floor(date.getTime() / ms) * ms);
}

// ⏱️ Fonction pour arrondir à la minute
function roundToMinute(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    0,
    0
  );
}

export const NewStudySessionForm = ({
  studyProcess,
}: {
  studyProcess: StudyProcess;
}) => {
  const [formState, formAction] = useActionState(createStudySessionAction, {
    errors: {},
  });
  const [urls, setUrls] = useState([""]);
  const [dateCreation, setDateCreation] = useState<any>(
    parseDate(new Date().toISOString().substring(0, 10))
  );

  // --- 🔥 STATE POUR L'HEURE DE DÉBUT ---
  const [startedAt, setStartedAt] = useState<Time | null>(null);

  // --- 🔥 MISE À JOUR AUTOMATIQUE TOUTES LES MINUTES ---
  useEffect(() => {
    function updateTime() {
      const now = roundToMinute(new Date());
      setStartedAt(new Time(now.getHours(), now.getMinutes()));
    }

    updateTime(); // 1ère mise à jour immédiate

    const interval = setInterval(updateTime, 60_000); // chaque minute

    return () => clearInterval(interval);
  }, []);

  let formatter = useDateFormatter({ dateStyle: "full" });

  function addUrl() {
    setUrls([...urls, ""]);
  }

  function handleUrlRemove(index: number) {
    setUrls(urls.filter((url, i) => index !== i));
  }

  function handleUrlChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const index = Number(evt.currentTarget.dataset.index);

    const nextUrls = urls.map((url, i) => {
      if (i === index) {
        return evt.currentTarget.value;
      } else {
        return url;
      }
    });

    setUrls(nextUrls);
  }

  const dateCreationStr = new Intl.DateTimeFormat("fr-Fr", {
    dateStyle: "full",
  }).format(dateCreation.toDate(getLocalTimeZone()));

  return (
    <Card className="relative p-4 w-full lg:w-2/5 rounded-2xl bg-white dark:bg-content1">
      <CardBody>
        <div className="flex flex-col gap-4">
          <Form
            action={formAction}
            className="flex flex-col justify-start w-full gap-6"
          >
            <div className="flex flex-row items-center justify-around w-full gap-2">
              <h1 className="text-xs sm:text-lg">
                {dateCreationStr.slice(0, 1).toUpperCase() +
                  dateCreationStr.slice(1)}
              </h1>
              <div className="ml-auto">
                <DatePicker
                  aria-labelledby="date picker new study session"
                  name="date"
                  className="max-w-[150px]"
                  value={dateCreation}
                  onChange={setDateCreation}
                  minValue={parseDate(
                    new Intl.DateTimeFormat("en-CA", {
                      timeZone: "Europe/Paris",
                    }).format(studyProcess.createdAt)
                  )}
                />
              </div>
            </div>

            {formState.errors._form ? (
              <div className="text-danger text-sm">
                {formState.errors._form?.join(", ")}
              </div>
            ) : null}

            <Input
              type="hidden"
              name="studyProcessId"
              value={studyProcess.id}
            />

            <div className="flex flex-col w-full">
              <div className="flex flex-row w-full gap-3 mb-2">
                {formState.errors.startedAt ? (
                  <div className="text-danger text-sm">
                    {formState.errors.startedAt?.join(", ")}
                  </div>
                ) : null}
                {formState.errors.finishedAt ? (
                  <div className="text-danger text-sm">
                    {formState.errors.finishedAt?.join(", ")}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-row w-full gap-3">
                <TimeInput
                  label="Débuté à"
                  className="flex-1"
                  name="startedAt"
                  hourCycle={24}
                  value={startedAt}
                  onChange={setStartedAt}
                />
                <TimeInput
                  label="Terminé à"
                  className="flex-1"
                  name="finishedAt"
                  hourCycle={24}
                />
              </div>
            </div>

            <Textarea
              className="flex-3"
              label="Veuillez décrire le contenu de votre session"
              name="description"
            />

            <Input type="hidden" name="urls" value={urls.join(",")} />

            {formState.errors.urls ? (
              <div className="text-danger text-sm">
                {formState.errors.urls?.join(", ")}
              </div>
            ) : null}

            {urls.map((url, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-row w-full gap-4 items-center"
                >
                  <LinkIcon />
                  <Input
                    type="text"
                    value={url}
                    data-index={index}
                    placeholder="Saisissez l'adresse url d'un contenu utilisé lors de cette session"
                    onChange={handleUrlChange}
                  />
                  <Button
                    onPress={() => handleUrlRemove(index)}
                    className="bg-white dark:bg-dark-bg min-w-15"
                  >
                    <DeleteIcon width="1.5em" height="1.5em" />
                  </Button>
                </div>
              );
            })}

            <Button
              onPress={addUrl}
              className="ml-auto bg-secondary-400 text-white min-w-15"
            >
              <PlusIcon />
            </Button>

            <Button type="submit" className="bg-sky-500 text-white">
              Enregistrer la session
            </Button>
          </Form>
        </div>
      </CardBody>
    </Card>
  );
};
