import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="page-shell">
      <div className="page-shell__aurora page-shell__aurora--one" aria-hidden="true" />
      <div className="page-shell__aurora page-shell__aurora--two" aria-hidden="true" />
      <AppHeader />
      <main className="page-content">{children}</main>
    </div>
  );
}
