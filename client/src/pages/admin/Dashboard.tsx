import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import { api } from "../../lib/api";
import { formatDateTime } from "../../lib/format";
import type { EnquiryStatus } from "../../types";

interface StatsResponse {
  total: number;
  pendingFollowUps: number;
  byStatus: Array<{ status: string; count: number }>;
  byType: Array<{ type: string; count: number }>;
  recent: Array<{ reference: string; name: string; status: string; submittedAt: string }>;
  monthly: Array<{ _id: string; count: number }>;
}

const STATUS_ORDER: EnquiryStatus[] = ["New", "In Progress", "Contacted", "Closed"];

const STATUS_COLORS: Record<string, string> = {
  New: "#B89458",
  "In Progress": "#6FA8DC",
  Contacted: "#6FCF97",
  Closed: "#9A9A9A",
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function statusColor(status: string): string {
  return STATUS_COLORS[status] ?? "#9A9A9A";
}

function StatusPill({ status }: { status: string }) {
  const color = statusColor(status);
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em]"
      style={{ color, borderColor: `${color}66`, backgroundColor: `${color}1A` }}
    >
      {status}
    </span>
  );
}

function monthLabel(value: string): string {
  const [year, month] = value.split("-");
  const index = Number.parseInt(month ?? "", 10) - 1;
  const name = MONTH_LABELS[index] ?? value;
  const shortYear = (year ?? "").slice(2);
  return shortYear ? `${name} ${shortYear}` : name;
}

function Panel({
  title,
  eyebrow,
  action,
  children,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-white/10 bg-charcoal p-5 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h2 className="font-display text-xl text-warm-white sm:text-2xl">{title}</h2>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="gold-rule mt-3 w-full max-w-[90px]" />
      <div className="mt-5">{children}</div>
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
  icon,
}: {
  label: string;
  value: number;
  hint: string;
  accent: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 border border-white/10 bg-charcoal p-5">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center border"
        style={{ borderColor: `${accent}55`, backgroundColor: `${accent}1A`, color: accent }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.24em] text-ash">{label}</p>
        <p className="mt-1 font-display text-3xl leading-none text-warm-white">{value}</p>
        <p className="mt-2 text-xs leading-relaxed text-ash">{hint}</p>
      </div>
    </div>
  );
}

function MonthlyChart({ data }: { data: Array<{ _id: string; count: number }> }) {
  if (data.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-ash">
        No monthly volume has been recorded yet.
      </p>
    );
  }

  const width = 660;
  const height = 230;
  const padding = { top: 28, right: 12, bottom: 40, left: 12 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const max = Math.max(1, ...data.map((row) => row.count));
  const slot = innerWidth / data.length;
  const barWidth = Math.min(56, slot * 0.52);

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Enquiry volume per month"
      >
        <line
          x1={padding.left}
          y1={padding.top + innerHeight}
          x2={padding.left + innerWidth}
          y2={padding.top + innerHeight}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth={1}
        />
        {data.map((row, index) => {
          const barHeight = Math.max(2, (row.count / max) * innerHeight);
          const x = padding.left + index * slot + (slot - barWidth) / 2;
          const y = padding.top + innerHeight - barHeight;
          return (
            <g key={row._id}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill="#B89458" opacity={0.9} />
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize={11}
                fill="#F5F1E9"
              >
                {row.count}
              </text>
              <text
                x={x + barWidth / 2}
                y={padding.top + innerHeight + 20}
                textAnchor="middle"
                fontSize={11}
                fill="#9A9A9A"
              >
                {monthLabel(row._id)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get<StatsResponse>("/admin/enquiries/stats", { auth: true });
      setStats(data);
    } catch (err) {
      setStats(null);
      setError(
        err instanceof Error ? err.message : "We could not load the dashboard. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const row of stats?.byStatus ?? []) {
      counts[row.status] = row.count;
    }
    return counts;
  }, [stats]);

  const typeMax = useMemo(
    () => Math.max(1, ...(stats?.byType ?? []).map((row) => row.count)),
    [stats],
  );

  const pendingRecent = useMemo(
    () =>
      (stats?.recent ?? []).filter(
        (row) => row.status === "New" || row.status === "In Progress",
      ),
    [stats],
  );

  if (loading) {
    return (
      <div className="container-luxe flex min-h-[60vh] items-center justify-center bg-jet-black">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          <p className="text-xs uppercase tracking-[0.3em] text-ash">Loading enquiries</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container-luxe bg-jet-black py-16">
        <div className="border border-red-500/40 bg-red-500/10 p-6">
          <div className="flex items-start gap-3">
            <Icon name="close" size={18} className="mt-0.5 shrink-0 text-red-200" />
            <div className="flex-1">
              <p className="font-display text-xl text-warm-white">Dashboard unavailable</p>
              <p className="mt-2 text-sm text-red-100">{error || "No data was returned."}</p>
              <Button
                variant="outlineLight"
                size="sm"
                className="mt-4"
                onClick={() => void load()}
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-luxe bg-jet-black pb-16">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1 className="mt-2 font-display text-3xl tracking-wide text-warm-white sm:text-4xl">
            Enquiry overview
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ash">
            Live volume, status mix and the conversations that still need a reply from the atelier.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outlineLight"
            size="sm"
            icon={<Icon name="refresh" size={14} />}
            onClick={() => void load()}
          >
            Refresh
          </Button>
          <Button to="/admin/enquiries" variant="gold" size="sm" icon={<Icon name="list" size={14} />}>
            All enquiries
          </Button>
        </div>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total enquiries"
          value={stats.total}
          hint="Every enquiry received by the storefront."
          accent="#B89458"
          icon={<Icon name="note" size={20} />}
        />
        <StatCard
          label="Pending follow-ups"
          value={stats.pendingFollowUps}
          hint="Still New or In Progress and awaiting a reply."
          accent="#6FA8DC"
          icon={<Icon name="clock" size={20} />}
        />
        {STATUS_ORDER.map((status) => (
          <StatCard
            key={status}
            label={status}
            value={statusCounts[status] ?? 0}
            hint={`Enquiries currently marked ${status.toLowerCase()}.`}
            accent={statusColor(status)}
            icon={<Icon name="tag" size={20} />}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Panel
          title="Monthly volume"
          eyebrow="Last 6 months"
          action={
            <span className="text-[11px] uppercase tracking-[0.2em] text-ash">
              {stats.monthly.length} month{stats.monthly.length === 1 ? "" : "s"}
            </span>
          }
        >
          <MonthlyChart data={stats.monthly} />
        </Panel>

        <Panel title="Breakdown by type" eyebrow="Enquiry mix">
          {stats.byType.length === 0 ? (
            <p className="py-8 text-center text-sm text-ash">
              No enquiries have been recorded yet, so there is nothing to break down.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {stats.byType.map((row) => (
                <li key={row.type}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm text-warm-white">{row.type}</span>
                    <span className="shrink-0 font-display text-lg text-gold">{row.count}</span>
                  </div>
                  <div className="mt-2 h-1 w-full bg-white/10">
                    <div
                      className="h-1 bg-gold"
                      style={{ width: `${Math.max(4, (row.count / typeMax) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Panel
          title="Recent enquiries"
          eyebrow="Latest submissions"
          action={
            <Button to="/admin/enquiries" variant="ghost" size="sm">
              View all
            </Button>
          }
        >
          {stats.recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-ash">
              No enquiries have been submitted yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-ash">
                    <th className="pb-3 pr-4 font-medium">Reference</th>
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((row) => (
                    <tr key={row.reference} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4 whitespace-nowrap text-gold">{row.reference}</td>
                      <td className="py-3 pr-4 break-words text-warm-white">{row.name}</td>
                      <td className="py-3 pr-4">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="py-3 whitespace-nowrap text-ash">
                        {formatDateTime(row.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel
          title="Pending follow-ups"
          eyebrow={`${stats.pendingFollowUps} awaiting a reply`}
        >
          {pendingRecent.length === 0 ? (
            <p className="py-8 text-center text-sm text-ash">
              {stats.pendingFollowUps === 0
                ? "Every enquiry has been handled. Nothing is waiting on us."
                : "No pending enquiries appear in the latest submissions. Open the full list to work through the backlog."}
            </p>
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {pendingRecent.map((row) => (
                  <li
                    key={row.reference}
                    className="flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-white/[0.02] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-warm-white">{row.name}</p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-ash">
                        {row.reference} · {formatDateTime(row.submittedAt)}
                      </p>
                    </div>
                    <StatusPill status={row.status} />
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-ash">
                Shown from the {stats.recent.length} most recent submissions. The full queue holds{" "}
                {stats.pendingFollowUps} open follow-up{stats.pendingFollowUps === 1 ? "" : "s"}.
              </p>
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}
