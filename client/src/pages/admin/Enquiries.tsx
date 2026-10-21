import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import { api } from "../../lib/api";
import { formatDateTime } from "../../lib/format";
import type { EnquiryRecord, EnquiryStatus, EnquiryType } from "../../types";

interface EnquiriesResponse {
  items: EnquiryRecord[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface StaffUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersResponse {
  items: StaffUser[];
}

interface Filters {
  q: string;
  status: string;
  type: string;
  from: string;
  to: string;
  assigned: string;
}

const EMPTY_FILTERS: Filters = {
  q: "",
  status: "",
  type: "",
  from: "",
  to: "",
  assigned: "",
};

const STATUS_OPTIONS: EnquiryStatus[] = ["New", "In Progress", "Contacted", "Closed"];

const TYPE_OPTIONS: EnquiryType[] = [
  "Product Enquiry",
  "Price Enquiry",
  "Bulk Order",
  "Corporate Gifting",
  "Partnership",
  "Other",
];

const STATUS_COLORS: Record<string, string> = {
  New: "#B89458",
  "In Progress": "#6FA8DC",
  Contacted: "#6FCF97",
  Closed: "#9A9A9A",
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

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

function buildParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.status) params.set("status", filters.status);
  if (filters.type) params.set("type", filters.type);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.assigned) params.set("assigned", filters.assigned);
  return params;
}

function fieldLabelClass(): string {
  return "mb-2 block text-[10px] uppercase tracking-[0.2em] text-ash";
}

export default function Enquiries() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState<EnquiriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [staffError, setStaffError] = useState("");

  const [exporting, setExporting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setApplied(filters);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filters]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = buildParams(applied);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const result = await api.get<EnquiriesResponse>(`/admin/enquiries?${params.toString()}`, {
        auth: true,
      });
      setData(result);
    } catch (err) {
      setData(null);
      setError(
        err instanceof Error ? err.message : "We could not load enquiries. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [applied, page, limit]);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  useEffect(() => {
    let active = true;
    api
      .get<UsersResponse>("/admin/users", { auth: true })
      .then((result) => {
        if (!active) return;
        const items = Array.isArray(result?.items) ? result.items : [];
        setStaff(items);
        setStaffError("");
      })
      .catch((err: unknown) => {
        if (!active) return;
        setStaff([]);
        setStaffError(
          err instanceof Error
            ? err.message
            : "The staff directory could not be loaded.",
        );
      });
    return () => {
      active = false;
    };
  }, []);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
  };

  const hasFilters = useMemo(
    () => Object.values(filters).some((value) => value.trim() !== ""),
    [filters],
  );

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = buildParams(applied);
      const response = await api.get<Response>(
        `/admin/enquiries/export?${params.toString()}`,
        { auth: true, raw: true },
      );
      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") ?? "";
      const match = /filename="?([^";]+)"?/i.exec(disposition);
      const filename = match?.[1] ?? `timecraft-enquiries-${Date.now()}.csv`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "The export could not be generated. Please try again.";
      setError(message);
    } finally {
      setExporting(false);
    }
  };

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;
  const currentPage = data?.page ?? page;
  const startIndex = items.length > 0 ? (currentPage - 1) * (data?.limit ?? limit) + 1 : 0;
  const endIndex = startIndex + items.length - 1;

  const pageNumbers = useMemo(() => {
    const windowSize = 5;
    if (pages <= windowSize) {
      return Array.from({ length: pages }, (_, index) => index + 1);
    }
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(pages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [pages, currentPage]);

  return (
    <div className="container-luxe bg-jet-black pb-16">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="eyebrow">Enquiries</span>
          <h1 className="mt-2 font-display text-3xl tracking-wide text-warm-white sm:text-4xl">
            Enquiry register
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ash">
            Every conversation the atelier has received, with status, ownership and the filters the
            service team works from.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outlineLight"
            size="sm"
            icon={<Icon name="download" size={14} />}
            loading={exporting}
            onClick={() => void handleExport()}
          >
            Export CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Icon name="refresh" size={14} />}
            onClick={() => setReloadKey((value) => value + 1)}
          >
            Refresh
          </Button>
        </div>
      </header>

      <section className="mt-8 border border-white/10 bg-charcoal p-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <div className="sm:col-span-2 xl:col-span-2">
            <label htmlFor="enquiry-search" className={fieldLabelClass()}>
              Search
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ash">
                <Icon name="search" size={16} />
              </span>
              <input
                id="enquiry-search"
                type="search"
                value={filters.q}
                onChange={(event) => updateFilter("q", event.target.value)}
                placeholder="Name, email, phone or reference"
                className="field pl-9"
              />
            </div>
          </div>

          <div>
            <label htmlFor="enquiry-status" className={fieldLabelClass()}>
              Status
            </label>
            <select
              id="enquiry-status"
              value={filters.status}
              onChange={(event) => updateFilter("status", event.target.value)}
              className="field"
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="enquiry-type" className={fieldLabelClass()}>
              Enquiry type
            </label>
            <select
              id="enquiry-type"
              value={filters.type}
              onChange={(event) => updateFilter("type", event.target.value)}
              className="field"
            >
              <option value="">All types</option>
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="enquiry-from" className={fieldLabelClass()}>
              From
            </label>
            <input
              id="enquiry-from"
              type="date"
              value={filters.from}
              onChange={(event) => updateFilter("from", event.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="enquiry-to" className={fieldLabelClass()}>
              To
            </label>
            <input
              id="enquiry-to"
              type="date"
              value={filters.to}
              onChange={(event) => updateFilter("to", event.target.value)}
              className="field"
            />
          </div>

          <div className="sm:col-span-2 xl:col-span-2">
            <label htmlFor="enquiry-assigned" className={fieldLabelClass()}>
              Assigned to
            </label>
            <select
              id="enquiry-assigned"
              value={filters.assigned}
              onChange={(event) => updateFilter("assigned", event.target.value)}
              className="field"
            >
              <option value="">Anyone</option>
              <option value="unassigned">Unassigned</option>
              {staff.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} · {member.role}
                </option>
              ))}
            </select>
            {staffError ? (
              <p className="mt-2 text-[11px] leading-relaxed text-ash">
                Staff directory unavailable ({staffError}). Ownership filters are limited for this
                account.
              </p>
            ) : null}
          </div>

          <div className="flex items-end sm:col-span-2 xl:col-span-4">
            <Button
              variant="ghost"
              size="sm"
              icon={<Icon name="close" size={14} />}
              onClick={clearFilters}
              disabled={!hasFilters}
              className="w-full sm:w-auto"
            >
              Clear filters
            </Button>
          </div>
        </div>
      </section>

      {error ? (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
        >
          <Icon name="close" size={16} className="mt-0.5 shrink-0 text-red-200" />
          <p className="flex-1">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-red-100 underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      <section className="mt-6 border border-white/10 bg-charcoal">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-ash">
            {loading
              ? "Loading…"
              : total === 0
                ? "0 enquiries"
                : `Showing ${startIndex}–${endIndex} of ${total}`}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="enquiry-limit" className="text-[10px] uppercase tracking-[0.2em] text-ash">
              Per page
            </label>
            <select
              id="enquiry-limit"
              value={limit}
              onChange={(event) => {
                setLimit(Number.parseInt(event.target.value, 10) || 20);
                setPage(1);
              }}
              className="field w-auto py-1.5 text-xs"
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-5 py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            <span className="text-xs uppercase tracking-[0.25em] text-ash">Loading enquiries</span>
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center border border-white/10 text-ash">
              <Icon name="note" size={22} />
            </span>
            <p className="mt-4 font-display text-xl text-warm-white">No enquiries found</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ash">
              {total === 0 && !hasFilters
                ? "No enquiries have been submitted through the storefront yet."
                : "No enquiries match the filters you have applied. Adjust or clear them to widen the search."}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-ash">
                    <th className="px-5 py-3 font-medium">Reference</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Assigned</th>
                    <th className="px-5 py-3 font-medium">Submitted</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item._id}
                      onClick={() => navigate(`/admin/enquiries/${item._id}`)}
                      className="cursor-pointer border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.04]"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/enquiries/${item._id}`}
                          onClick={(event) => event.stopPropagation()}
                          className="text-gold hover:underline"
                        >
                          {item.reference}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <p className="break-words text-warm-white">{item.name}</p>
                        <p className="mt-0.5 break-words text-[11px] text-ash">{item.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="break-words text-warm-white">{item.enquiryType}</p>
                        {item.productName ? (
                          <p className="mt-0.5 break-words text-[11px] text-ash">{item.productName}</p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill status={item.status} />
                      </td>
                      <td className="px-5 py-4">
                        {item.assignedTo ? (
                          <span className="break-words text-warm-white">{item.assignedTo.name}</span>
                        ) : (
                          <span className="text-[11px] uppercase tracking-[0.18em] text-ash">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-ash">
                        {formatDateTime(item.submittedAt)}
                      </td>
                      <td className="px-5 py-4 text-right text-ash">
                        <Icon name="chevronRight" size={16} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="flex flex-col divide-y divide-white/10 md:hidden">
              {items.map((item) => (
                <li key={item._id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/enquiries/${item._id}`)}
                    className="flex w-full flex-col gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                          {item.reference}
                        </p>
                        <p className="mt-1 break-words text-sm text-warm-white">{item.name}</p>
                        <p className="mt-0.5 break-words text-[11px] text-ash">{item.email}</p>
                      </div>
                      <StatusPill status={item.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-ash">
                      <p className="break-words">
                        <span className="block uppercase tracking-[0.16em]">Type</span>
                        <span className="text-warm-white">{item.enquiryType}</span>
                      </p>
                      <p className="break-words">
                        <span className="block uppercase tracking-[0.16em]">Assigned</span>
                        <span className="text-warm-white">
                          {item.assignedTo ? item.assignedTo.name : "Unassigned"}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] text-ash">{formatDateTime(item.submittedAt)}</p>
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-gold">
                        Open
                        <Icon name="chevronRight" size={14} />
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {pages > 1 ? (
          <nav
            aria-label="Enquiry pagination"
            className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-ash">
              Page {currentPage} of {pages}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage <= 1}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-warm-white transition hover:border-gold/60 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <Icon name="chevronLeft" size={16} />
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  aria-current={number === currentPage ? "page" : undefined}
                  className={`h-9 min-w-9 border px-2 text-xs transition ${
                    number === currentPage
                      ? "border-gold bg-gold text-jet-black"
                      : "border-white/10 text-warm-white hover:border-gold/60 hover:text-gold"
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(pages, value + 1))}
                disabled={currentPage >= pages}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-warm-white transition hover:border-gold/60 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <Icon name="chevronRight" size={16} />
              </button>
            </div>
          </nav>
        ) : null}
      </section>
    </div>
  );
}
