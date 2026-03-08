import { useEffect, useMemo, useState } from "react";
import defaultAvatar from "../../../assets/default-avatar.svg";
import Label from "../../../shared/ui/Label";
import { fetchTeamByDepartment, type TeamDepartment } from "../api/team.api";

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export default function TeamSection() {
  const [departments, setDepartments] = useState<TeamDepartment[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTeam = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTeamByDepartment();
        if (isMounted) {
          setDepartments(data);
          setSelectedDepartment("ALL");
          setError(
            data.length === 0
              ? "Backend endpointi personel verisi dondurmedi."
              : null,
          );
        }
      } catch (err) {
        if (isMounted) {
          setDepartments([]);
          setError(err instanceof Error ? err.message : "Takim bilgileri alinamadi.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTeam();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalMembers = useMemo(
    () => departments.reduce((acc, department) => acc + department.members.length, 0),
    [departments],
  );

  const visibleDepartments = useMemo(() => {
    if (selectedDepartment === "ALL") {
      return departments;
    }
    return departments.filter((department) => department.department === selectedDepartment);
  }, [departments, selectedDepartment]);

  const hasTeamData = !isLoading && departments.length > 0;

  return (
    <section
      id="team-section"
      className="min-h-screen scroll-mt-24 bg-[radial-gradient(circle_at_top_right,_#fdf2f8_0%,_#ffffff_45%),radial-gradient(circle_at_bottom_left,_#f0f9ff_0%,_#ffffff_45%)] px-6 py-24 md:px-20"
    >
      <div className="mx-auto max-w-6xl">
        <Label>TAKIM</Label>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-[#111827] md:text-5xl">
            Departman bazli, uzmanlik odakli Trivexa ekibi.
          </h2>
          <p className="max-w-xl text-base leading-7 text-[#4b5563]">
            Takim verisi backend uzerinden canli gelir. Her uye rol ve departmanina gore listelenir.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-[#e5e7eb] bg-white/80 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Toplam Uye</p>
            <p className="mt-2 text-3xl font-semibold text-[#111827]">{isLoading ? "..." : totalMembers}</p>
          </article>
          <article className="rounded-2xl border border-[#e5e7eb] bg-white/80 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Departman</p>
            <p className="mt-2 text-3xl font-semibold text-[#111827]">{isLoading ? "..." : departments.length}</p>
          </article>
          <article className="rounded-2xl border border-[#e5e7eb] bg-white/80 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Kaynak</p>
            <p className="mt-2 text-lg font-semibold text-[#111827]">Backend /landing/team</p>
          </article>
        </div>

        {hasTeamData && (
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedDepartment("ALL")}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selectedDepartment === "ALL"
                  ? "border-[#111827] bg-[#111827] text-white"
                  : "border-[#d1d5db] bg-white text-[#374151] hover:border-[#9ca3af]"
              }`}
            >
              Tum Departmanlar
            </button>
            {departments.map((department) => (
              <button
                key={department.department}
                type="button"
                onClick={() => setSelectedDepartment(department.department)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selectedDepartment === department.department
                    ? "border-[#111827] bg-[#111827] text-white"
                    : "border-[#d1d5db] bg-white text-[#374151] hover:border-[#9ca3af]"
                }`}
              >
                {formatLabel(department.department)} ({department.members.length})
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 space-y-8">
          {isLoading && (
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
                  <div className="h-5 w-40 animate-pulse rounded bg-[#e5e7eb]" />
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((__, innerIndex) => (
                      <div key={innerIndex} className="rounded-xl border border-[#f3f4f6] p-4">
                        <div className="h-12 w-12 animate-pulse rounded-full bg-[#e5e7eb]" />
                        <div className="mt-3 h-4 w-24 animate-pulse rounded bg-[#e5e7eb]" />
                        <div className="mt-2 h-3 w-16 animate-pulse rounded bg-[#f3f4f6]" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-6 text-sm text-[#b91c1c]">
              {error}
            </div>
          )}

          {!isLoading && departments.length > 0 && visibleDepartments.length === 0 && (
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 text-sm text-[#4b5563]">
              Secilen filtrede gosterilecek personel bulunamadi.
            </div>
          )}

          {hasTeamData && visibleDepartments.map((department) => (
            <article key={department.department} className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
              <div className="flex items-center justify-between gap-4 border-b border-[#f3f4f6] pb-4">
                <h3 className="text-xl font-semibold text-[#111827]">{formatLabel(department.department)}</h3>
                <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-semibold text-[#4b5563]">
                  {department.members.length} uye
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {department.members.map((member) => (
                  <div
                    key={member.id}
                    className="group rounded-xl border border-[#e5e7eb] bg-[#fcfcfd] p-4 transition hover:-translate-y-0.5 hover:border-[#cbd5e1]"
                  >
                    <img
                      src={member.avatarUrl || defaultAvatar}
                      alt={member.fullName}
                      className="h-14 w-14 rounded-full border border-[#e5e7eb] object-cover"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = defaultAvatar;
                      }}
                    />
                    <p className="mt-3 text-sm font-semibold text-[#111827]">{member.fullName}</p>
                    <p className="mt-1 text-xs text-[#6b7280]">{formatLabel(member.role)}</p>
                    <p className="mt-2 text-[11px] font-medium text-[#6b7280]">
                      {member.isActive ? "Aktif" : "Pasif"}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
