import { TopBar, type Breadcrumb } from "@components";
import { useLayout } from "@surfaces/InternalApp/LayoutContext";
import "./PageShell.css";

export type PageShellProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  right?: React.ReactNode;
  children: React.ReactNode;
};

// Cadrul fiecarui ecran cabinet: TopBar (fix) + zona de continut scrollabila.
export function PageShell({ title, subtitle, breadcrumbs, right, children }: PageShellProps) {
  const { toggleSidebar } = useLayout();
  return (
    <>
      <TopBar
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        right={right}
        onToggleSidebar={toggleSidebar}
      />
      <div className="page-scroll">{children}</div>
    </>
  );
}
