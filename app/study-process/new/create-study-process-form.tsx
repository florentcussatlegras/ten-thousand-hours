"use client";

import { createStudyProcess } from "@/app/actions/create-study-process.action";
import SearchBarHomepage from "@/components/search-bar-homepage";
import {
  Form,
  Input,
  Button,
  Textarea,
  addToast,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
  NumberInput,
  Autocomplete,
  AutocompleteItem,
  Card,
  CardBody,
  CardHeader
} from "@heroui/react";
import { Topic } from "@prisma/client";
import { SearchIcon } from "lucide-react";
import { useActionState, useState } from "react";

export default function StudyProcessCreateForm({
  topics,
}: {
  topics: Topic[];
}) {
  const [formState, formAction] = useActionState(createStudyProcess, {
    errors: {},
  });

  // const [currentDescription, setCurrentDescription] = useState(description);
  let topicName: string | null = "";
  let initialTopicId = null;
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("new_study_process")
  ) {
    topicName = localStorage.getItem("new_study_process");
    localStorage.removeItem("new_study_process");
    initialTopicId = topics.filter((topic) => topic.name === topicName)[0].id;
  }

  const [currentName, setCurrentName] = useState(
    `Devenir un expert en ${topicName}`,
  );
  const [currentTopicId, setCurrentTopicId] = useState(initialTopicId);
  const [currentTopicName, setCurrentTopicName] = useState(topicName);

  function handleTopicChange(value: string | null) {
    console.log(value);
    setCurrentTopicName(value);
    if (!value) {
      setCurrentTopicId(null); // reset topicId si champ vide
    } else {
      setCurrentTopicId(topics.filter((topic) => topic.name === value)[0].id);
    }
  }

  return (
    <Card
      className="flex flex-col items-center p-6 bg-white dark:bg-content1 w-full md:w-2/3 lg:w-1/2"
    >
      <CardHeader className="flex flex-col gap-2 mb-4 items-start p-0">
        <h1 className="text-4xl font-bold mb-4 text-default-600 p-0">
          Nouvel Apprentissage
        </h1>
        <p className="text-mute-foreground p-0">
          Créer un nouvel apprentissage auquelle vous rajouterez des sessions de
          travail
        </p>
      </CardHeader>
      <CardBody className="overflow-x-hidden p-0 w-full">
        <Form
          action={formAction}
          className="space-y-8"
        >
          <Input type="hidden" name="topicId" value={String(currentTopicId)} />

          <Autocomplete
            aria-label="Selectionner une matière"
            inputValue={String(currentTopicName)}
            classNames={{
              base: "max-w-full mb-8",
              listboxWrapper: "max-h-[320px]",
              selectorButton: "text-default-500",
            }}
            defaultItems={topics}
            inputProps={{
              classNames: {
                input: "ml-4 text-base text-default-600",
                inputWrapper:
                  "h-[60px] border-1 border-default-100 shadow-lg dark:bg-content1",
              },
            }}
            listboxProps={{
              hideSelectedIcon: true,
              itemClasses: {
                base: [
                  "rounded-medium",
                  "text-default-500",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "dark:data-[hover=true]:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                  "data-[hover=true]:bg-default-200",
                  "data-[selectable=true]:focus:bg-default-100",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              },
            }}
            placeholder="Exple: saxophone, javascript, maçonnerie..."
            popoverProps={{
              offset: 10,
              classNames: {
                base: "rounded-large",
                content: "p-1 border-small border-default-100 bg-background",
              },
            }}
            radius="full"
            startContent={
              <SearchIcon
                className="text-default-400"
                size={20}
                strokeWidth={2.5}
              />
            }
            variant="bordered"
            onInputChange={handleTopicChange}
          >
            {(item) => (
              <AutocompleteItem key={item.id} textValue={item.name}>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    {/* <Avatar alt={item.name} className="shrink-0" size="sm" src={item.avatar} /> */}
                    <div className="flex flex-col">
                      <span className="text-base">{item.name}</span>
                      {/* <span className="text-tiny text-default-400">{item.team}</span> */}
                    </div>
                  </div>
                  {/* <Button
                      className="border-small mr-0.5 font-medium shadow-small"
                      radius="full"
                      size="sm"
                      variant="bordered"
                      >
                      Add
                      </Button> */}
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>

          {formState.errors?._form ? (
            <div className="text-danger text-sm">
              {formState.errors?._form.join(", ")}
            </div>
          ) : null}

          <h1 className="uppercase text-2xl font-medium">
            Je veux devenir une star de{" "}
            <span className="text-sky-500">{currentTopicName}</span>
          </h1>

          <div className="flex w-full">
            <div className="flex flex-col justify-start items-start gap-2">
              <label>
                Saisissez le nombre d'heure que vous envisagez d'y consacrer
                (facultatif)
              </label>
              <div className="flex flex-row gap-4">
                <NumberInput
                  color={
                    formState.errors.timeDedicated !== undefined
                      ? "danger"
                      : "default"
                  }
                  name="timeDedicated"
                  classNames={{
                    base: "flex-3",
                    // input: "w-[150px]",
                    mainWrapper: "w-[150px]",
                    inputWrapper: "w-[150px] h-[60px]",
                  }}
                  size="lg"
                  maxValue={200}
                  hideStepper
                />
                <RadioGroup
                  name="timeDedicatedPeriod"
                  className="flex items-center justify-end"
                  defaultValue="day"
                >
                  <Radio value="day">Par jour</Radio>
                  <Radio value="week">Par semaine</Radio>
                </RadioGroup>
              </div>
            </div>
          </div>

          <Textarea
            color={
              formState.errors.description !== undefined ? "danger" : "default"
            }
            label="Description"
            labelPlacement="outside-top"
            name="description"
            type="text"
            size="lg"
            classNames={{
              base: "items-start",
              input: "py-4",
            }}
          />
          {formState.errors.description ? (
            <div className="text-danger text-sm">
              {formState.errors.description?.join(", ")}
            </div>
          ) : null}

          <Button
            type="submit"
            className="uppercase text-white bg-sky-500 font-bold dark:text-black dark:bg-default-600 w-full lg:w-auto"
          >
            Valider
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}
