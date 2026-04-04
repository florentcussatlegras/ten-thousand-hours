"use client";

import {
  fetchStudyProcessByTopic,
  getTopicsOfaUser,
} from "@/app/actions/actions";
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  addToast,
} from "@heroui/react";
import { Pause, Play, SearchIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { checkCurrentStudySessionAction } from "@/app/actions/check-study-session.action";



export function CurrentStudySession() {
  const router = useRouter();

  const modal1 = useDisclosure();

  const [topics, setTopics] = useState<any>([]);
  const [currentTopicId, setCurrentTopicId] = useState("");
  const [currentTopicName, setCurrentTopicName] = useState();

  const [hoursStartedAt, setHoursStartedAt] = useState(0);

  useEffect(() => {
    async function getTopics() {
      const allTopics: any[] = await getTopicsOfaUser();

      setTopics(allTopics);
    }

    getTopics();
    modal1.onClose();
  }, []);

  function handleTopicChange(value: any) {
    if (value === "") {
      setCurrentTopicId("");
    } else {
      setCurrentTopicId(
        topics.filter((topic: any) => topic.topic_name === value)[0].topic_id
      );
    }
    setCurrentTopicName(value);
    localStorage.setItem("current_study_session_topic_name", value);
  }

  return (
    <div className="mr-4">
      
        <>
          <Button
            onPress={modal1.onOpen}
            type="submit"
            className="text-white rounded-full bg-sky-500"
          >
            <Play />
          </Button>
          <Modal
            isOpen={modal1.isOpen}
            onOpenChange={modal1.onOpenChange}
            size="xl"
          >
            <ModalContent className="bg-white dark:bg-dark-bg">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 w-full mt-4">
                    <h1>Nouvelle session de travail test</h1>
                  </ModalHeader>
                  <ModalBody className="flex flex-col gap-2 w-full my-4">
                    <Form className="flex gap-8">
                      <Input
                        type="hidden"
                        name="topicId"
                        value={currentTopicId}
                      />
                      <Input
                        type="hidden"
                        name="startedAt"
                        value={String(hoursStartedAt)}
                      />
                      <Autocomplete
                        aria-label="Selectionner une matière"
                        //   inputValue={currentTopicName}
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
                        placeholder="Exple: javascript, mongodb..."
                        popoverProps={{
                          offset: 10,
                          classNames: {
                            base: "rounded-large",
                            content:
                              "p-1 border-small border-default-100 bg-background",
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
                        {(item: any) => (
                          <AutocompleteItem
                            key={item.topic_id}
                            textValue={item.topic_name}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2 items-center">
                                <div className="flex flex-col">
                                  <span className="text-base">
                                    {item.topic_name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    </Form>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
     
    </div>
  );
}
