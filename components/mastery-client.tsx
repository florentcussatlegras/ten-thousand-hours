"use client";

import Link from "next/link";
import { BadgesHeader } from "./badges-header";
import { MasteredTopic, ProgressTopic } from "@/app/types/mastery";

export default function MasteryClient({
  mastered = [],
  inProgress = [],
}: {
  mastered: MasteredTopic[];
  inProgress: ProgressTopic[]; // topics not yet mastered, used to show close-to-master
}) {
  const hours = (s: number) => Math.round((s / 3600) * 10) / 10;
  const formatDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString("fr-FR") : "";

  const totalMastered = mastered.length;
  const totalHoursAll = mastered.reduce((acc, t) => acc + t.totalSeconds, 0) + inProgress.reduce((acc,t)=> acc + t.totalSeconds,0);
  const avgTimeToMaster = mastered.length ? Math.round((mastered.reduce((acc,t)=>acc + t.totalSeconds,0) / mastered.length) / 3600) : 0;

  // Titles by count
  const title = (() => {
    if (totalMastered >= 10) return "Grand Maître";
    if (totalMastered >= 5) return "Polymathe";
    if (totalMastered >= 3) return "Multi-Spécialiste";
    if (totalMastered >= 1) return "Maître en devenir";
    return "Apprenant";
  })();

  return (
    <div className="px-6 w-full">
      {/* Header */}
      <div className="flex justify-between w-full mb-4">
        {/* <div>
          <p className="text-sm text-default-500">
            Les matières pour lesquelles vous avez atteint les 10 000 heures.
          </p>
        </div> */}
        <div>
            <BadgesHeader mastered={mastered} inProgress={inProgress} />
        </div>

        {/* <div className="text-lg font-semibold text-sky-500">{title}</div> */}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: stats */}
        <aside className="space-y-4">
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-default-500">Matières maîtrisées</div>
                <div className="text-2xl font-bold">{totalMastered}</div>
              </div>
              <div>
                <div className="text-xs text-default-500">Heures cumulées</div>
                <div className="text-2xl font-bold">{Math.round(totalHoursAll/3600)}</div>
              </div>
              {/* <div>
                <div className="text-xs text-default-500">Moyenne (h → master)</div>
                <div className="text-2xl font-bold">{avgTimeToMaster}</div>
              </div> */}
              {/* <div>
                <div className="text-xs text-default-500">Dernière maîtrisée</div>
                <div className="text-2xl font-bold">
                  {mastered[0] ? formatDate(mastered[0].reachedAt) : "—"}
                </div>
              </div> */}
            </div>
          </div>

          

          <div className="p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold">En progression</h4>
            <div className="mt-3 space-y-3">
              {inProgress.length === 0 && <div className="text-sm text-default-500">Aucun proche de 10k.</div>}
              {inProgress.map((t) => {
                const pct = Math.min(100, Math.round((t.totalSeconds / (10000 * 3600)) * 10000) / 100);
                return (
                  <div key={t.id}>
                    <div className="flex justify-between text-sm">
                      <div>{t.name}</div>
                      <div className="text-default-500">{Math.round(t.totalSeconds/3600)}h</div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                      <div style={{ width: `${pct}%` }} className="h-2 rounded-full bg-sky-500" />
                    </div>
                  </div>
                );
              })}
              <Link href="/studies" className="text-sm px-3 py-1 bg-sky-500 text-white rounded-md">Voir tous mes apprentissages</Link>
            </div>
          </div>
        </aside>

        {/* Center: mastered cards */}
        <section className="lg:col-span-2 space-y-6">
 
            {mastered.length === 0 && (
              <div className="p-6 border border-gray-200 rounded-lg text-default-500">
                Vous n'avez pas encore atteint 10 000 heures sur une matière.
              </div>
            )}

            {mastered.map((t) => (
              <article key={t.id} className="p-4 border border-gray-200 rounded-lg flex gap-4 items-start">
                <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                  {t.icon ?? "🏅"}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="font-semibold text-lg">{t.name}</h3>
                      <div className="text-xs text-default-500 mt-1">Atteint le {formatDate(t.reachedAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-default-500">Heures totales</div>
                      <div className="text-xl font-bold">{hours(t.totalSeconds)} h</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end">
                    {/* <div className="text-sm text-default-500">Voir le parcours</div> */}
                    <div className="flex items-center gap-2">
                      <Link href={`/study-process/${t.slug}`} className="text-sm px-3 py-1 bg-sky-500 text-white rounded-md">Détails</Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
    

          {/* Timeline */}
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold mb-3">Timeline des maîtrises</h4>
            <ol className="relative border-l border-gray-200">
              {mastered.map((t, i) => (
                <li key={t.id} className="mb-6 ml-6">
                  <span className="absolute -left-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-white text-xs">
                    {i + 1}
                  </span>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-default-500">{formatDate(t.reachedAt)} — {hours(t.totalSeconds)} h</div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
