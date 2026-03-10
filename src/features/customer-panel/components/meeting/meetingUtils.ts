import type { CustomerPanelTicket } from "../../model/types";

export interface CalendarCell {
  key: string;
  date: Date;
  day: number;
  isCurrentMonth: boolean;
}

export const WEEKDAY_LABELS = ["Pzt", "Sal", "Car", "Per", "Cum", "Cmt", "Paz"];
export const MONTH_LABELS = [
  "Ocak",
  "Subat",
  "Mart",
  "Nisan",
  "Mayis",
  "Haziran",
  "Temmuz",
  "Agustos",
  "Eylul",
  "Ekim",
  "Kasim",
  "Aralik",
];

export function toDateKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDate(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateTime(value?: string): string {
  const parsed = parseDate(value);
  if (!parsed) return "-";
  return parsed.toLocaleString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(value?: string): string {
  const parsed = parseDate(value);
  if (!parsed) return "-";
  return parsed.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function extractRequestedDateTime(value?: string): string {
  const text = String(value || "");
  const match = text.match(/tercih edilen tarih-saat:\s*([^\r\n]+)/i);
  return match?.[1]?.trim() || "";
}

export function extractRequestedDuration(value?: string): string {
  const text = String(value || "");
  const match = text.match(/tahmini sure:\s*(\d+)/i);
  const parsed = Number.parseInt(match?.[1] || "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return "-";
  return `${parsed} dk`;
}

export function mapRequestStatus(item: CustomerPanelTicket): string {
  const approval = (item.approvalStatus || "").toUpperCase();
  const status = (item.status || "").toUpperCase();
  if (status === "CLOSED" || status === "COMPLETED" || status === "RESOLVED") {
    return "Tamamlandi";
  }
  if (approval === "APPROVED") return "Onaylandi";
  if (approval === "REJECTED") return "Reddedildi";
  return "Onay Bekliyor";
}

export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return "-";
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  const leftMinutes = minutes % 60;
  return leftMinutes > 0 ? `${hours} sa ${leftMinutes} dk` : `${hours} sa`;
}

export function trimText(value?: string): string {
  return value?.trim() || "";
}

export function buildCalendarCells(monthDate: Date): CalendarCell[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const mondayBasedFirstDay = (firstDayOfMonth.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - mondayBasedFirstDay);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return {
      key: `${date.toISOString()}-${index}`,
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
    };
  });
}
