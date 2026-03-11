import {useEffect, useState, type FormEvent} from "react";
import type {CreateCustomerTicketInput, CustomerPanelProject} from "../../model/types";
import SectionHeader from "../../../../shared/ui/SectionHeader";
import Surface from "../../../../shared/ui/Surface";

interface MeetingRequestFormProps {
    projects: CustomerPanelProject[];
    selectedProjectId: string;
    isCreating: boolean;
    errorMessage: string | null;
    onCreateMeetingRequest: (input: CreateCustomerTicketInput) => Promise<void>;
}

export default function MeetingRequestForm({
                                               projects,
                                               selectedProjectId,
                                               isCreating,
                                               errorMessage,
                                               onCreateMeetingRequest,
                                           }: MeetingRequestFormProps) {
    const [requestTitle, setRequestTitle] = useState("");
    const [requestDetails, setRequestDetails] = useState("");
    const [requestProjectId, setRequestProjectId] = useState("");
    const [requestPriority, setRequestPriority] = useState("MEDIUM");
    const [requestedDateTime, setRequestedDateTime] = useState("");
    const [requestedDuration, setRequestedDuration] = useState("");
    const [requestFormError, setRequestFormError] = useState<string | null>(null);
    const [requestFormSuccess, setRequestFormSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (selectedProjectId) {
            const timer = setTimeout(() => setRequestProjectId(selectedProjectId), 0);
            return () => clearTimeout(timer);
        }
    }, [selectedProjectId]);

    async function handleSubmitMeetingRequest(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setRequestFormError(null);
        setRequestFormSuccess(null);

        if (!requestTitle.trim()) {
            setRequestFormError("Konu zorunludur.");
            return;
        }

        if (!requestedDateTime) {
            setRequestFormError("Tercih edilen tarih ve saat zorunludur.");
            return;
        }

        if (!requestDetails.trim()) {
            setRequestFormError("Gorusme amaci/aciklamasi zorunludur.");
            return;
        }

        const composedDescription = [
            "Gorusme talebi olusturuldu.",
            `Tercih edilen tarih-saat: ${requestedDateTime}`,
            `Tahmini sure: ${requestedDuration || "30"} dk`,
            `Aciklama: ${requestDetails.trim()}`,
        ].join("\n");

        try {
            await onCreateMeetingRequest({
                subject: `Gorusme Talebi - ${requestTitle.trim()}`,
                description: composedDescription,
                priority: requestPriority,
                type: "OTHER",
                projectId: requestProjectId || undefined,
            });

            setRequestFormSuccess("Gorusme istegi basariyla olusturuldu.");
            setRequestTitle("");
            setRequestDetails("");
            setRequestedDateTime("");
            setRequestedDuration("30");
        } catch (error) {
            if (error instanceof Error && error.message) {
                setRequestFormError(error.message);
            } else {
                setRequestFormError("Gorusme istegi olusturulamadi.");
            }
        }
    }

    return (
        <Surface as="article" className="p-5">
            <SectionHeader
                title="Gorusme istegi olustur"
                description="Bu alandan dogrudan gorusme istegi acabilirsiniz."
            />

            <form className="mt-4 space-y-3" onSubmit={handleSubmitMeetingRequest}>
                <input
                    value={requestTitle}
                    onChange={(event) => setRequestTitle(event.target.value)}
                    placeholder="Gorusme konusu"
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-900"
                />

                <textarea
                    value={requestDetails}
                    onChange={(event) => setRequestDetails(event.target.value)}
                    placeholder="Gorusme amaci ve beklentiniz"
                    className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-900"
                />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <select
                        value={requestProjectId}
                        onChange={(event) => setRequestProjectId(event.target.value)}
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-900"
                    >
                        <option value="">Proje secin (opsiyonel)</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={requestPriority}
                        onChange={(event) => setRequestPriority(event.target.value)}
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-900"
                    >
                        <option value="LOW">Dusuk</option>
                        <option value="MEDIUM">Orta</option>
                        <option value="HIGH">Yuksek</option>
                        <option value="URGENT">Acil</option>
                    </select>

                    <input
                        type="datetime-local"
                        value={requestedDateTime}
                        onChange={(event) => setRequestedDateTime(event.target.value)}
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-900"
                    />

                    <input
                        type="number"
                        min={15}
                        max={60}
                        step={15}
                        value={requestedDuration}
                        onChange={(event) => setRequestedDuration(event.target.value)}
                        placeholder="Sure (dk)"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-900"
                    />
                </div>

                {(requestFormError || errorMessage) && (
                    <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                        {requestFormError || errorMessage}
                    </p>
                )}

                {requestFormSuccess && (
                    <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                        {requestFormSuccess}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isCreating}
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isCreating ? "GONDERILIYOR..." : "GORUSME ISTEGI OLUSTUR"}
                </button>
            </form>
        </Surface>
    );
}
