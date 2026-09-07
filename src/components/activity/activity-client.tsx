"use client";

interface ActivityClientProps {
  children: React.ReactNode;
}

export default function ActivityClient({
  children,
}: ActivityClientProps) {
  return <>{children}</>;
}