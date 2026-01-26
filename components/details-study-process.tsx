"use client";

import { fetchCurrentStudySession } from "@/app/actions/actions";
import { launchStudySessionAction } from "@/app/actions/launch-study-session.action";
import { useSession } from "@/app/lib/auth-client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Form,
  Input,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { StudyProcess } from "@prisma/client";
import { CheckCheckIcon, CheckCircle, ThumbsUpIcon, Timer } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { validateCurrentStudySessionAction } from "@/app/actions/validate-current-study-session.action";
import { CurrentStudySession } from "./current-study-session";
import { convertSecondsInHourMin } from "@/app/lib/utils";
import { RemainingTime } from "./remaining-time";

const SECOND = 1_000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export default function DetailsStudyProcess({
  studyProcess,
}: {
  studyProcess: StudyProcess;
}) {
  // const { data: session } = useSession();
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // const [formLaunchCurrentSessionState, formLaunchCurrentSessionAction] = useActionState(launchStudySessionAction, {
  //   errors: {},
  // });

  // const [formValidateCurrentSessionState, formValidateCurrentSessionAction] = useActionState(validateCurrentStudySessionAction, {
  //   errors: {},
  // });

  // const [currentStudySession, setCurrentStudySession] = useState(null);

  // const [timespanCurrentStudySession, setTimespanCurrentStudySession] =
  //   useState(0);

  // const [daysElapsedCurrentStudySession, setDaysElapsedCurrentStudySession] =
  //   useState(0);
  // const [hoursElapsedCurrentStudySession, setHoursElapsedCurrentStudySession] =
  //   useState(0);
  // const [
  //   minutesElapsedCurrentStudySession,
  //   setMinutesElapsedCurrentStudySession,
  // ] = useState(0);
  // const [
  //   secondsElapsedCurrentStudySession,
  //   setSecondsElapsedCurrentStudySession,
  // ] = useState(0);

  // useEffect(() => {
  //   async function getCurrentStudySession() {
  //     const newCurrentStudySession = await fetchCurrentStudySession();
  //     setCurrentStudySession(newCurrentStudySession);
  //   }

  //   getCurrentStudySession();
  // }, []);

  // useEffect(() => {
  //   if (currentStudySession !== null) {
  //     let diffTime = 0
  //     if (Date.now() - Date.parse(currentStudySession.startedAt) > 0) {
  //       diffTime = Date.now() - Date.parse(currentStudySession.startedAt);
  //     }
  //     setTimespanCurrentStudySession(
  //       diffTime
  //     );

  //     const intervalId = setInterval(() => {
  //       setTimespanCurrentStudySession((_timespan) => _timespan + 1000);
  //     }, 1000);

  //     return () => {
  //       clearInterval(intervalId);
  //     };
  //   }
  // }, [currentStudySession]);

  // useEffect(() => {
  //   setDaysElapsedCurrentStudySession(
  //     Math.floor(timespanCurrentStudySession / DAY)
  //   );
  //   setHoursElapsedCurrentStudySession(
  //     Math.floor((timespanCurrentStudySession / HOUR) % 24)
  //   );
  //   setMinutesElapsedCurrentStudySession(
  //     Math.floor((timespanCurrentStudySession / MINUTE) % 60)
  //   );
  //   setSecondsElapsedCurrentStudySession(
  //     Math.floor((timespanCurrentStudySession / SECOND) % 60)
  //   );
  // }, [timespanCurrentStudySession]);

  const ratioProgress = (Number(studyProcess.totalSeconds) / 36000000) * 100;
  // let timeDisplayed = Math.round(studyProcess.totalSeconds / 60);
  // let strTimeDisplayed = "";
  // if (timeDisplayed >= 60) {
  //   if (Math.round(timeDisplayed / 60) <= 1) {
  //     strTimeDisplayed = Math.round(timeDisplayed / 60) + " heure";
  //   } else {
  //     strTimeDisplayed = Math.round(timeDisplayed / 60) + " heures";
  //   }
  // } else {
  //   if (Math.round(timeDisplayed) <= 1) {
  //     strTimeDisplayed = Math.round(timeDisplayed) + " minute";
  //   } else {
  //     strTimeDisplayed = Math.round(timeDisplayed) + " minutes";
  //   }
  // }

  // const hours = Math.floor(studyProcess.totalSeconds / 3600);
  // const minutes = Math.floor((studyProcess.totalSeconds - hours * 3600) / 60);
  // const seconds = studyProcess.totalSeconds - hours * 3600 - minutes * 60;

  const timeString = convertSecondsInHourMin(Number(studyProcess.totalSeconds));

  var intl = new Intl.DateTimeFormat("fr-Fr", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="rounded-2xl relative p-4 bg-white dark:bg-content1">
      <CardHeader className="flex gap-2 items-start">
        {/* <h2 className="font-bold text-sky-500">{studyProcess.topic.name}</h2> */}
        <span className="text-default-500 text-xs md:text-sm mt-0 md:mt-2 xl:mt-4">
          Apprentissage débuté le {intl.format(studyProcess.createdAt)}
        </span>
        {studyProcess.totalSeconds && studyProcess.totalSeconds >= 36000000 ? (
          <div className="ml-auto flex text-sm items-center gap-4 text-success-600 uppercase">
            <span
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800`}
            >
              🏆 10k Master
            </span>
            <span>
              Bravo ! Vous avez atteint les 10000 heures, vous êtes un pro !
            </span>
            <CheckCircle size={50} />
          </div>
        ) : (
          <div className="ml-auto flex items-center gap-4 text-neutral-600 dark:text-white text-xs md:text-sm uppercase">
            {studyProcess.totalSeconds === 0 ? (
              <span>
                Lancez-vous ! C'est toujours le premier pas le plus difficile
              </span>
            ) : (
              <span>
                {/* A ce rythme là vous aurez atteint les 10000 heures de pratique{" "}
                {<RemainingTime studyProcess={studyProcess} />}, persevérez ! */}
                Vous êtes sur la bonne voie, persevérez !
              </span>
            )}

            <ThumbsUpIcon
              size={40}
              className="mb-4 text-success hidden md:block"
            />
          </div>
        )}
        {/* <div className="ml-auto">
          <CurrentStudySession studyProcess={studyProcess} />
        </div> */}
      </CardHeader>
      <CardBody className="flex flex-col">
        <Chip isDisabled color="secondary">
          {timeString}
        </Chip>
        <Progress
          aria-label="Loading..."
          className="w-full"
          classNames={{
            indicator: "bg-sky-500",
            track: "drop-shadow-md border border-default",
            value: "ml-auto text-foreground/60 text-sm",
          }}
          value={ratioProgress}
          showValueLabel={true}
        />
      </CardBody>
    </Card>
  );
}
