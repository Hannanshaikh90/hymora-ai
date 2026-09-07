interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  return (
    <div className="grid h-screen grid-cols-[280px_1fr_340px] bg-[#050505]">
      {children}
    </div>
  );
}