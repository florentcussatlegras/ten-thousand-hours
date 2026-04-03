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
import { useRouter } from "next/navigation";
import { checkCurrentStudySessionAction } from "@/app/actions/check-study-session.action";

function buildLocalDate(dateStr: string, timeStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);
  return new Date(y, m - 1, d, h, min, 0, 0);
}

export function CurrentStudySession() {
  const router = useRouter();

  const modal1 = useDisclosure();
  const modal2 = useDisclosure();

  const [time, setTime] = useState({ sec: 0, min: 0, hr: 0 });
  const [intervalId, setIntervalId] = useState<any>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [topics, setTopics] = useState<any[]>([]);
  const [currentTopicId, setCurrentTopicId] = useState("");
  const [currentTopicName, setCurrentTopicName] = useState("");
  const [hoursStartedAt, setHoursStartedAt] = useState(0);

  // Chargement des topics et session existante
  useEffect(() => {
    async function loadData() {
      const allTopics = await getTopicsOfaUser();
      setTopics(allTopics);

      const savedTimer = localStorage.getItem("current_study_session_timer");
      if (savedTimer) setTime(JSON.parse(savedTimer));

      const savedTopicId = localStorage.getItem(
        "current_study_session_topic_id"
      );
      if (savedTopicId) setCurrentTopicId(savedTopicId);

      const savedTopicName = localStorage.getItem(
        "current_study_session_topic_name"
      );
      if (savedTopicName) setCurrentTopicName(savedTopicName);

      const savedStart = localStorage.getItem(
        "current_study_session_started_at"
      );
      if (savedStart) setHoursStartedAt(Number(savedStart));

      const savedPlaying = localStorage.getItem(
        "current_study_session_is_playing"
      );
      if (savedPlaying === "true") startTimer();
    }
    loadData();
  }, []);

  // Gestion du timer
  const startTimer = () => {
    if (!intervalId) {
      const id = setInterval(() => {
        setTime((prev) => {
          const newTime = { ...prev };
          newTime.sec += 1;
          if (newTime.sec === 60) {
            newTime.sec = 0;
            newTime.min += 1;
          }
          if (newTime.min === 60) {
            newTime.min = 0;
            newTime.hr += 1;
          }
          localStorage.setItem(
            "current_study_session_timer",
            JSON.stringify(newTime)
          );
          return newTime;
        });
      }, 1000);
      setIntervalId(id);
      setIsPlaying(true);
      localStorage.setItem("current_study_session_is_playing", "true");
    }
  };

  const pauseOrResume = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(undefined);
      setIsPlaying(false);
      localStorage.setItem("current_study_session_is_playing", "false");
    } else startTimer();
  };

  const clearSessionStorage = () => {
    [
      "current_study_session_topic_id",
      "current_study_session_topic_name",
      "current_study_session_started_at",
      "current_study_session_timer",
      "current_study_session_is_playing",
      "current_study_session_finished_at",
      "current_study_session_resume",
    ].forEach((key) => localStorage.removeItem(key));
  };

  const handleTopicSelect = (value: string) => {
    const topic = topics.find((t) => t.topic_name === value);
    setCurrentTopicName(value);
    if (topic) setCurrentTopicId(topic.topic_id);
  };

  const handleLaunchSession = async () => {
    if (!currentTopicId) return;
    const now = new Date();
    const studyProcess = await fetchStudyProcessByTopic(currentTopicId);
    if (!studyProcess) {
      alert("Aucun process associé à ce topic !");
      return;
    }

    const checkDate = buildLocalDate(
      now.toISOString().split("T")[0],
      `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );

    const alreadyExists = await checkCurrentStudySessionAction(
      studyProcess.id,
      checkDate
    );
    if (alreadyExists) {
      alert("Cette session existe déjà dans cette tranche horaire.");
      return;
    }

    // Démarrage
    localStorage.setItem("current_study_session_topic_id", currentTopicId);
    localStorage.setItem(
      "current_study_session_topic_name",
      currentTopicName
    );
    const startTime = new Date().getTime();
    setHoursStartedAt(startTime);
    localStorage.setItem("current_study_session_started_at", String(startTime));

    setTime({ sec: 0, min: 0, hr: 0 });
    localStorage.setItem(
      "current_study_session_timer",
      JSON.stringify({ sec: 0, min: 0, hr: 0 })
    );

    startTimer();
    modal2.onOpen();
  };

  const handleReset = () => {
    clearInterval(intervalId);
    setIntervalId(undefined);
    setIsPlaying(false);
    setTime({ sec: 0, min: 0, hr: 0 });
    clearSessionStorage();
    modal1.onClose();
    addToast({
      title: "Session annulée",
      description: "La session a bien été annulée",
      color: "success",
    });
  };

  const handleValidate = () => {
    localStorage.setItem(
      "current_study_session_finished_at",
      String(new Date().getTime())
    );
    clearInterval(intervalId);
    setIntervalId(undefined);
    setIsPlaying(false);
    localStorage.setItem("current_study_session_is_playing", "false");
    modal1.onClose();
    modal2.onClose();
    router.push("/study-session/current/validate/");
  };

  return (
    <div className="mr-4">
      {!currentTopicId ? (
        <>
          <Button
            onPress={modal1.onOpen}
            type="button"
            className="text-white rounded-full bg-sky-500"
          >
            <Play />
          </Button>
          <Modal isOpen={modal1.isOpen} onOpenChange={modal1.onOpenChange} size="xl">
            <ModalContent className="bg-white dark:bg-dark-bg">
              <ModalHeader>
                <h1>Nouvelle session de travail</h1>
              </ModalHeader>
              <ModalBody>
                <Form className="flex flex-col gap-4">
                  <Autocomplete
                    aria-label="Sélectionner une matière"
                    defaultItems={topics}
                    inputProps={{ placeholder: "Exple: javascript, mongodb..." }}
                    onInputChange={handleTopicSelect}
                  >
                    {(item: any) => (
                      <AutocompleteItem key={item.topic_id} textValue={item.topic_name}>
                        {item.topic_name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onPress={handleLaunchSession}
                      className="bg-sky-500 text-white"
                      isDisabled={!currentTopicId}
                    >
                      Lancer la session
                    </Button>
                    <Button color="danger" variant="light" onPress={modal1.onClose}>
                      Fermer
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 bg-success rounded-full h-[45px] ml-4">
            <Button onPress={pauseOrResume} className="bg-success text-white rounded-l-full">
              {isPlaying ? <Pause size={25} /> : <Play size={25} />}
            </Button>
            <Button onPress={modal2.onOpen} className="bg-green-500 text-white rounded-r-full h-[35px]">
              {`${time.hr} h ${time.min} min ${time.sec} s`}
            </Button>
          </div>

          <Modal isOpen={modal2.isOpen} onOpenChange={modal2.onOpenChange} size="3xl">
            <ModalContent className="p-4 bg-white dark:bg-dark-bg">
              <ModalHeader>
                Session en cours: <span className="text-sky-500">{currentTopicName}</span>
              </ModalHeader>
              <ModalBody>
                <div>{`Session commencée à ${new Date(hoursStartedAt).toLocaleTimeString()}`}</div>
                <div className="flex items-center gap-4 bg-success text-white font-semibold py-2 px-4 rounded-full">
                  <Button onPress={pauseOrResume}>
                    {isPlaying ? <Pause size={40} /> : <Play size={40} />}
                  </Button>
                  <div>{`${time.hr} h ${time.min} min ${time.sec} s`}</div>
                </div>
              </ModalBody>
              <ModalFooter className="flex gap-2">
                <Button onPress={handleValidate} className="bg-sky-500 text-white">Terminer</Button>
                <Button onPress={handleReset} className="bg-secondary text-white">Annuler</Button>
                <Button onPress={modal2.onClose} color="danger" variant="light">Fermer</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
}