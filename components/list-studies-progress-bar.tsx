"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import {
  Divider,
  Progress,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Chip,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
} from "@heroui/react";
import Link from "next/link";
import { AddIcon, DeleteIcon, VerticalDotsIcon } from "./icons";

interface StudyProgression {
  id: UUID;
  totalSeconds: String;
  slug: String;
  topic_id: String;
  topic_name: String;
  category_topic_id: String;
  category_topic_name: String;
  // topic?: {
  //   name?: String;
  // };
}

import React, { useState } from "react";
import { CategoryTopic, StudyProcess } from "@prisma/client";
import { UUID } from "crypto";
import { Check, CheckCircle, PlusIcon, SearchIcon, Timer } from "lucide-react";

export const EyeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-eye-icon lucide-eye text-default-600"
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

export const ThreeDotsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
};

export default function ListStudiesProgressbar({
  userStudies,
  categoryTopics,
  studyProcessAchievedLength,
}: {
  userStudies: StudyProgression[];
  categoryTopics: any[];
  studyProcessAchievedLength: Number;
}) {
  const [studyProcesses, setStudyProcesses] = useState(userStudies);
  const [searchItem, setSearchItem] = useState("");

  function handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = evt.currentTarget.value;
    setSearchItem(searchItem);

    const filteredStudyProcesses = userStudies.filter((study) => {
      return study.topic_name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setStudyProcesses(filteredStudyProcesses);
  }

  function handleSelectChange(value: string) {
    let filteredStudyProcesses = null;

    switch (value) {
      case "beginner":
        filteredStudyProcesses = userStudies.filter((study) => {
          return Number(study.totalSeconds) <= 18000000;
        });
        break;

      case "intermediate":
        filteredStudyProcesses = userStudies.filter((study) => {
          return (
            Number(study.totalSeconds) > 18000000 && Number(study?.totalSeconds) < 36000000
          );
        });
        break;

      case "expert":
        filteredStudyProcesses = userStudies.filter((study) => {
          return Number(study?.totalSeconds) >= 36000000;
        });
        break;

      default:
        filteredStudyProcesses = userStudies;
        break;
    }

    setStudyProcesses(filteredStudyProcesses);
  }

  return (
    <Card className="h-full rounded-2xl bg-white dark:bg-content1">
      {/* <CardHeader className="flex flex-col items-start gap-3 p-4">
        <h2 className="text-md font-medium text-black/90">
          Mes apprentissages
        </h2>
        <Divider />
      </CardHeader> */}
      <CardBody className="p-6">
        <div className="flex flex-col gap-8 h-full justify-start">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-default-500 text-sm uppercase">
              {Number(studyProcessAchievedLength)} objectif
              {Number(studyProcessAchievedLength) > 1 && "s"} atteint{" "}
              {Number(studyProcessAchievedLength) > 1 && "s"}
            </div>
            <div className="flex-1/3 justify-center flex flex-col md:flex-row items-center gap-12">
              <Input
                startContent={<SearchIcon />}
                onChange={handleInputChange}
                className="w-[300px]"
              />
              <RadioGroup
                defaultValue="all"
                orientation="horizontal"
                onValueChange={handleSelectChange}
              >
                <Radio value="all" className="text-xs"><span className="text-sm">Tous</span></Radio>
                <Radio value="beginner"><span className="text-sm">Débutant</span></Radio>
                <Radio value="intermediate"><span className="text-sm">Intermédiaire</span></Radio>
                <Radio value="expert"><span className="text-sm">Expert</span></Radio>
              </RadioGroup>
            </div>

            {/* <Button
              startContent={<AddIcon />}
              className="bg-secondary-400 text-white ml-auto py-4"
            > */}
            <Link
              href="/study-process/new"
              className="bg-secondary-400 text-white md:ml-auto p-4 rounded-2xl"
            >
              <PlusIcon />
              {/* Ajouter un nouvel apprentissage */}
            </Link>
            {/* </Button> */}
          </div>
          <div className="flex flex-col gap-6 items-stretch h-full justify-center">
            {studyProcesses.length !== 0 ? (
              categoryTopics.map((categoryTopic, index) => {
                const newStudyProcesses = studyProcesses.filter(
                  (study) =>
                    study.category_topic_id === categoryTopic.category_topic_id
                );
                if (newStudyProcesses.length > 0) {
                  return (
                    <div key={index} className="flex flex-col gap-4">
                      <h1 className="uppercase">
                        {categoryTopic.category_topic_name}
                      </h1>
                      {newStudyProcesses.map((study) => {
                        // if (study.category_topic_id === categoryTopic.category_topic_id) {
                        const ratioProgress =
                          (Number(study.totalSeconds) / 36000000) * 100;
                        return (
                          <div
                            className="flex items-center gap-4 relative"
                            key={study.id}
                          >
                            <Progress
                              aria-label="Loading..."
                              label={study?.topic_name}
                              className="w-full"
                              classNames={{
                                indicator: "bg-sky-500",
                                track: "drop-shadow-md border border-default",
                                value: "ml-auto text-foreground/60 text-sm",
                              }}
                              value={ratioProgress}
                              showValueLabel={true}
                            />
                            <div className="absolute -top-1 right-26">
                              {ratioProgress >= 100 ? (
                                <Chip color="success" className="text-white">
                                  Expert
                                </Chip>
                              ) : ratioProgress >= 50 ? (
                                <Chip color="warning" className="text-white">
                                  Intermédiaire
                                </Chip>
                              ) : (
                                <Chip color="default" className="text-white">
                                  Débutant
                                </Chip>
                              )}
                            </div>
                            <Dropdown>
                              <DropdownTrigger>
                                {/* <Button className="bg-white w-[20px] border border-default-100 place-items-end">
                          <ThreeDotsIcon />
                        </Button> */}
                                <Button isIconOnly size="sm" variant="light">
                                  <VerticalDotsIcon size={24} width={24} height={24} />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu aria-label="Static Actions">
                                <DropdownItem key="details">
                                  <Link
                                    href={`/study-process/${study?.slug}`}
                                    className="text-lg cursor-pointer active:opacity-50 flex flex-row items-center gap-2"
                                  >
                                    <EyeIcon />
                                    <span className="text-sm">
                                      Afficher les détails
                                    </span>
                                  </Link>
                                </DropdownItem>
                                <DropdownItem key="delete">
                                  <Link
                                    href=""
                                    className="text-lg text-danger cursor-pointer active:opacity-50 flex flex-row items-center gap-2"
                                  >
                                    <DeleteIcon />
                                    <span className="text-sm">
                                      Supprimer l'apprentissage
                                    </span>
                                  </Link>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        );
                        // } else {
                        //   return null;
                        // }
                      })}
                    </div>
                  );
                } else {
                  return null;
                }
              })
            ) : (
              <span className="text-default-400 text-xs md:text-base uppercase w-full text-center italic my-30">
                Aucun apprentissage en cours
              </span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
