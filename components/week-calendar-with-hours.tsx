import { useMemo } from "react";
import { StudySessionModal } from "./study-session-modal";
import ThreeDotsLoader from "./three-dots-loader";

export default function WeekCalendarWithHours({
  weekDates,
  studySessionsPerDay,
  isLoading,
}: {
  weekDates: Date[];
  studySessionsPerDay: any[][];
  isLoading: boolean;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (h: number) => `${h.toString().padStart(2, "0")}:00`;

  const weekLabel = useMemo(() => {
    const start = weekDates[0].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    });
    const end = weekDates[6].toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    });
    return `Semaine du ${start} au ${end}`;
  }, [weekDates]);

  const getPositionStyle = (startedAt: string, finishedAt: string) => {
    const startDate = new Date(startedAt);
    const endDate = new Date(finishedAt);
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;
    return {
      top: `${(startHour / 24) * 100}%`,
      height: `${((endHour - startHour) / 24) * 100}%`,
    };
  };

  return (
    <div>
      {/* Titre de la semaine */}
      <div className="uppercase inline-flex w-max h-8 items-center justify-center min-w-[280px] px-4 py-1 rounded-xl bg-white border dark:bg-content1 dark:text-white border-gray-300 text-gray-700 font-semibold text-sm shadow-sm absolute top-4 left-4 md:left-auto md:right-5 mt-2 z-40">
        {isLoading ? <ThreeDotsLoader /> : weekLabel}
      </div>

      {/* Wrapper scroll horizontal */}
      <div className="w-full overflow-x-auto relative">
        {/* Grille interne */}
        <div className="inline-block min-w-full w-max relative">
          {/* Overlay loader */}
          {isLoading && (
            <div className="absolute inset-0 z-50 flex items-start pt-80 justify-center bg-white/70 dark:bg-content1 backdrop-blur-sm">
              <ThreeDotsLoader />
            </div>
          )}

          {/* Grille */}
          <div className="grid grid-cols-8 border-t border-r border-l border-gray-200 dark:border-gray-500">
            {/* Colonne des heures */}
            <div className="flex flex-col border-gray-200 dark:border-gray-500 bg-gray-50 dark:bg-content1 mt-9 border-t">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="border-b border-gray-200 dark:border-gray-500 flex items-start justify-end pr-2 text-xs text-gray-500 bg-white dark:bg-content1 dark:text-white"
                  style={{ height: "calc(100% / 24)" }}
                >
                  {formatHour(hour)}
                </div>
              ))}
            </div>

            {/* 7 jours */}
            {weekDates.map((date, dayIndex) => (
              <div key={dayIndex} className="relative border-l border-gray-200">
                {/* Header du jour */}
                <div className="text-center py-2 border-b dark:border-gray-500 border-gray-200 bg-gray-50 text-sm font-medium dark:bg-content1 dark:text-white">
                  {date.toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "numeric",
                  })}
                </div>

                {/* Grille horaire */}
                <div className="relative h-[1600px]">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-b border-gray-200 dark:border-gray-500 bg-white dark:bg-content1 dark:text-white"
                      style={{
                        top: `${(hour / 24) * 100}%`,
                        height: "calc(100% / 24)",
                      }}
                    />
                  ))}

                  {/* Sessions */}
                  {!isLoading &&
                    studySessionsPerDay[date.getDay()]?.map((session: any) => {
                      const pos = getPositionStyle(
                        session.startedAt,
                        session.finishedAt
                      );

                      return (
                        <StudySessionModal
                          key={session.session_id}
                          session={session}
                          pos={pos}
                        />
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
