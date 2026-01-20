"use client";

import { Breadcrumb } from "@/components/breadcrumb";

export default function StudyProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-6 py-0 md:py-10 max-w-[1536] mx-auto">
      <Breadcrumb steps={[{ label: "Nouvel apprentissage" }]} />
      <div className="flex w-full text-center justify-center">{children}</div>
    </section>
  );
}
