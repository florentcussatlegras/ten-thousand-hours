"use client";

import React, { useActionState, useEffect } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  DatePicker,
  DateInput,
  DateRangePicker,
  Card,
  CardHeader,
  Form,
  TimeInput,
  Textarea,
  Divider,
  CardBody,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

import { CalendarDate } from "@internationalized/date";

import { StudyProcess, StudySession } from "@prisma/client";
import { createStudySessionAction } from "@/app/actions/create-study-session.action";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { fetchStudySessionsPerRangeDays } from "@/app/actions/actions";
import {
  ChevronDownIcon,
  DeleteIcon,
  EyeIcon,
  PlusIcon,
  VerticalDotsIcon,
} from "./icons";
import { PrismaClient } from "@prisma/client/scripts/default-index";
import Link from "next/link";
import ModalStudySessionView from "./modal-study-session-view";
import { EditIcon } from "./icons";

export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "DATE", uid: "createdAt", sortable: true },
  { name: "HEURE DEBUT", uid: "startedAt", sortable: true },
  { name: "HEURE FIN", uid: "finishedAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

export function capitalize(s: any) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "createdAt",
  "startedAt",
  "finishedAt",
  "actions",
];

export default function ListStudiesSession({
  onEditClick,
  studyProcessId,
  studySessions,
}: {
  onEditClick: any,
  studyProcessId: String,
  studySessions: StudySession[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [studySessionToView, setStudySessionToView] = React.useState<StudySession>();

  const [filterValue, setFilterValue] = React.useState(null);
  const [filteredItems, setFilteredItems] = React.useState(studySessions);
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<String>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<any>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (String(visibleColumns) === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleOpenModalView = (studySession: StudySession) => {
    setStudySessionToView(studySession);
    onOpen();
  };

  const renderCell = React.useCallback((studySession: any, columnKey: any) => {
    const cellValue = studySession[columnKey];

    const createdAt = new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "full",
    }).format(studySession.createdAt);

    const startedAt = new Intl.DateTimeFormat("fr-FR", {
      timeStyle: "short",
    }).format(studySession.startedAt);

    const finishedAt = new Intl.DateTimeFormat("fr-FR", {
      timeStyle: "short",
    }).format(studySession.finishedAt);

    switch (columnKey) {
      case "createdAt":
        return <div>{capitalize(createdAt)}</div>;
      case "startedAt":
        return <div>{startedAt}</div>;
      case "finishedAt":
        return <div>{finishedAt}</div>;
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2 w-3/5">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon size={24} width={24} height={24} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view">
                  <button
                    onClick={() => handleOpenModalView(studySession)}
                    className="p-0 h-[20px] flex flex-row gap-2 items-center cursor-pointer"
                  >
                    <EyeIcon />
                    <span>Voir les détails</span>
                  </button>
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  onClick={() => onEditClick(studySession.id)}
                >
                  <div className="flex flex-row w-full items-center gap-2 h-[20px]">
                    <EditIcon />
                    <span>Modifier</span>
                  </div>
                </DropdownItem>
                <DropdownItem key="delete">
                  <Link
                    href={`/study-session/delete/${studySession.id}`}
                    className="flex flex-row w-full items-center gap-2 h-[20px] text-danger-500"
                  >
                    <DeleteIcon />
                    <span>Supprimer</span>
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback(async (value: any) => {
    console.log(studyProcessId);
    if (value) {
      setFilterValue(value);
      const result = await fetchStudySessionsPerRangeDays(
        String(studyProcessId),
        value.start.year,
        value.start.month,
        value.start.day,
        value.end.year,
        value.end.month,
        value.end.day,
      );
      setFilteredItems(result);
      setPage(1);
    } else {
      setFilterValue(null);
    }
  }, []);

  const onClear = React.useCallback(async () => {
    setFilterValue(null);
    const result = await fetchStudySessionsPerRangeDays(
      String(studyProcessId),
      null,
      null,
      null,
      null,
      null,
      null,
    );
    setFilteredItems(result);
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <DateRangePicker
              aria-labelledby="date range picker for study session list"
              className="max-w-xs"
              classNames={{
                input: "text-sm",
              }}
              value={filterValue}
              onChange={onSearchChange}
            />
            <Button onPress={onClear}>Effacer</Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {studySessions.length} sessions
          </span>
          <label className="flex items-center text-default-400 text-small">
            Lignes par page:
            <select
              className="bg-transparent outline-solid outline-transparent text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    studySessions.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {String(selectedKeys) === "all"
            ? "Toutes les sessions sélectionnées"
            : `${selectedKeys.size} of ${filteredItems.length} selectionné`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            cursor: "bg-sky-500",
          }}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Précédent
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Suivant
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Card radius="none" className="w-full lg:w-2/3 px-6 py-8 rounded-2xl bg-white dark:bg-content1">
      <div>
        <ModalStudySessionView
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          studySession={studySessionToView}
        />
      </div>
      <Table
        isHeaderSticky
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "p-0",
          thead: "[&>tr[aria-hidden=true]]:hidden",
          tbody: "bg-white dark:bg-dark-bg",          
          th: "text-sm border-b-0",
          td: "text-sm",
        }}
        radius="none"
        shadow="none"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Aucune session trouvées"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
