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

  useEffect(() => {
    async function getTopics() {
      const allTopics: any[] = await getTopicsOfaUser();

      setTopics(allTopics);
    }

    getTopics();
    modal1.onClose();
  }, []);

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
                    <h1>Nouvelle session de travail test 2</h1>
                  </ModalHeader>
                  <ModalBody className="flex flex-col gap-2 w-full my-4">
                    <Form className="flex gap-8">
                      <Autocomplete>
                        {(item: any) => (
                          <AutocompleteItem
                            key={item.topic_id}
                            textValue={item.topic_name}
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
