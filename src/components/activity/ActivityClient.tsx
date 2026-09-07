"use client";

import { useMemo, useState } from "react";

export type ActivityFilter =
  | "all"
  | "conversation"
  | "knowledge"
  | "memory"
  | "workspace";

export interface ActivityItem {
  id: string;
  type: ActivityFilter extends "all" ? never : Exclude<ActivityFilter, "all">;
  workspaceId: string;
  workspaceTitle: string;
  description: string;
  timestamp: string;
}

interface WorkspaceSummary {
  id: string;
  title: string;
  conversationCount: number;
  knowledgeCount: number;
  memoryCount: number;
  lastActive: string | null;
}

interface ActivityClientProps {
  activities: ActivityItem[];
  workspaces: WorkspaceSummary[];

  children: (data: {
    search: string;
    setSearch: (value: string) => void;

    filter: ActivityFilter;
    setFilter: (value: ActivityFilter) => void;

    activities: ActivityItem[];
    workspaces: WorkspaceSummary[];
  }) => React.ReactNode;
}

export default function ActivityClient({
  activities,
  workspaces,
  children,
}: ActivityClientProps) {
  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<ActivityFilter>("all");

  const filteredActivities =
    useMemo(() => {
      let result = activities;

      if (filter !== "all") {
        result = result.filter(
          (item) =>
            item.type === filter
        );
      }

      const query =
        search.trim().toLowerCase();

      if (!query) {
        return result;
      }

      return result.filter((item) => {
        return (
          item.description
            .toLowerCase()
            .includes(query) ||
          item.workspaceTitle
            .toLowerCase()
            .includes(query)
        );
      });
    }, [
      activities,
      search,
      filter,
    ]);

  const filteredWorkspaceIds =
    new Set(
      filteredActivities.map(
        (item) => item.workspaceId
      )
    );

  const filteredWorkspaces =
    useMemo(() => {
      return workspaces.filter(
        (workspace) =>
          filteredWorkspaceIds.has(
            workspace.id
          )
      );
    }, [
      workspaces,
      filteredWorkspaceIds,
    ]);

  return (
    <>
      {children({
        search,
        setSearch,

        filter,
        setFilter,

        activities:
          filteredActivities,

        workspaces:
          filteredWorkspaces,
      })}
    </>
  );
}