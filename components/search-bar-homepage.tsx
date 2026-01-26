"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Form,
} from "@heroui/react";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { MoveRightIcon } from "./icons";
import { Topic } from "@prisma/client";
import { useRouter } from "next/navigation";

const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width = null,
  height = null,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

interface TopicsProps {
  id: string,
  name: string,
  description: string,
  status: boolean,
}

export default function SearchBarHomepage({ topics }: { topics: TopicsProps[] }) {
  const router = useRouter();

  type FormValues = {
    topicName: string;
  };

  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    localStorage.setItem("new_study_process", data.topicName);

    router.push("/study-process/new");
  };

  const onError: SubmitErrorHandler<FormValues> = (errors) =>
    console.log(errors);

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-y-8 w-[320px] sm:w-[500px] lg:w-[600px] xl:w-[700px]"
    >
      <div className="w-full relative place-items-center grid">
        <Autocomplete
          {...register("topicName")}
          aria-label="Selectionner une matière"
          classNames={{
            base: "max-w-full]",
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
      </div>

      <Button
        type="submit"
        className="bg-sky-500 text-white px-8 py-6 text-xl font-bold rounded-lg cursor-pointer flex items-center gap-4 dark:bg-default-500 dark:text-white"
      >
        <span>C'est parti !</span>
        <MoveRightIcon />
      </Button>
    </Form>
  );
}
