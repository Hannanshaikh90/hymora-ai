type ActivityItem = {
  id: number;
  title: string;
  time: string;
};

const activities: ActivityItem[] = [
  {
    id: 1,
    title: "Added Nike Brand Guide",
    time: "2h ago",
  },
  {
    id: 2,
    title: "Updated Workspace Objective",
    time: "5h ago",
  },
  {
    id: 3,
    title: "Generated Campaign Strategy",
    time: "Yesterday",
  },
  {
    id: 4,
    title: "Uploaded Research PDF",
    time: "2 days ago",
  },
];

export function ActivityFeed() {
  return (
    <div className="rounded-[28px] border border-white/5 bg-[#101010] p-6">
      <h3 className="text-lg font-semibold text-white">
        Recent Activity
      </h3>

      <div className="mt-6 space-y-5">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4"
          >
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-500" />

            <div>
              <p className="text-sm text-white">
                {activity.title}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}