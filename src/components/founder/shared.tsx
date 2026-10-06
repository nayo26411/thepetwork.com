import { useEffect, useRef, type ReactNode } from "react";

export function SectionHead({
  title,
  sub,
  actions,
}: {
  title: string;
  sub: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "good" | "warn" | "bad" | "muted";
  children: ReactNode;
}) {
  const cls = {
    good: "bg-verified/15 text-verified",
    warn: "bg-honey/50 text-honey-foreground",
    bad: "bg-destructive/10 text-destructive",
    muted: "bg-oat text-muted-foreground ring-1 ring-border",
  }[tone];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}
    >
      {children}
    </span>
  );
}

/**
 * A data table that turns into stacked cards on phones. Each cell is labelled
 * with its column name (set after render) so the card view can show it.
 */
export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  const ref = useRef<HTMLTableSectionElement>(null);
  useEffect(() => {
    ref.current?.querySelectorAll("tr").forEach((row) => {
      row.querySelectorAll(":scope > td").forEach((cell, i) => {
        (cell as HTMLElement).dataset["label"] = head[i] ?? "";
      });
    });
  });

  return (
    <div className="table-cards card-cozy overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            {head.map((h, i) => (
              <th key={h || i} scope="col" className="relative px-4 py-3 font-bold">
                {h || <span className="sr-only">Actions</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody ref={ref} className="divide-y divide-border">
          {children}
        </tbody>
      </table>
    </div>
  );
}

/** The numbers behind a chart, for screen readers (the drawing itself is hidden from them). */
export function ChartValues({
  data,
  unit = "",
}: {
  data: { name: string; value: number }[];
  unit?: string;
}) {
  return (
    <ul className="sr-only">
      {data.map((d) => (
        <li key={d.name}>
          {d.name}: {d.value}
          {unit}
        </li>
      ))}
    </ul>
  );
}
