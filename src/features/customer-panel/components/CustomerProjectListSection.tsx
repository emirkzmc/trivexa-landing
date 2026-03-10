import type { CustomerPanelProject } from "../model/types";
import SectionHeader from "../../../shared/ui/SectionHeader";
import Surface from "../../../shared/ui/Surface";

interface CustomerProjectListSectionProps {
  projects: CustomerPanelProject[];
  onSelectProject: (projectId: string) => void;
}

export default function CustomerProjectListSection({
  projects,
  onSelectProject,
}: CustomerProjectListSectionProps) {
  return (
    <Surface className="p-6">
      <SectionHeader
        title="Projelerim"
        description="Projelere tiklayarak detaylarini goruntuleyebilirsiniz."
      />

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-2 py-3 font-semibold">Proje</th>
              <th className="px-2 py-3 font-semibold">Ilerleme</th>
              <th className="px-2 py-3 font-semibold">Durum</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-2 py-6 text-center text-sm text-slate-500">
                  Backend'de proje bulunmuyor.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className="cursor-pointer border-b border-slate-100 text-slate-700 transition hover:bg-slate-50"
                >
                  <td className="px-2 py-3 font-semibold text-slate-900">{project.name}</td>
                  <td className="px-2 py-3">{project.progress}</td>
                  <td className="px-2 py-3">{project.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}
