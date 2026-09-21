import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";

interface ModulePageProps {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  actionLabel: string;
}

export function ModulePlaceholder({
  title,
  description,
  emptyTitle,
  emptyDescription,
  actionLabel,
}: ModulePageProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={<Button disabled>{actionLabel}</Button>}
      />
      <EmptyState title={emptyTitle} description={emptyDescription} />
    </div>
  );
}
