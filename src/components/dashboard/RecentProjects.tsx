import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string | null;
}

interface RecentProjectsProps {
  projects: Project[];
}

export function RecentProjects({
  projects,
}: RecentProjectsProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-lg font-semibold text-white mb-4">
        Recent Projects
      </h2>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-white/40">
            No projects yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="
                block
                rounded-xl
                border
                border-white/10
                p-4
                hover:border-violet-500/40
                hover:bg-white/[0.03]
                transition
              "
            >
              <h3 className="font-medium text-white">
                {project.title}
              </h3>

              <p className="text-sm text-white/40 mt-1">
                {project.description ||
                  "No description"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}