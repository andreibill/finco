import { Card, Badge, Button, useToast } from "@components";
import { FileRow } from "@features/private/PeriodDetail/FileRow";
import { useDownloadPeriod } from "@hooks/usePeriods";
import type { FileItem } from "@types";
import "./LotGroup.css";

export type LotGroupProps = {
  lot: number;
  files: FileItem[];
  periodId: string;
};

export function LotGroup({ lot, files, periodId }: LotGroupProps) {
  const downloadPeriod = useDownloadPeriod();
  const { showToast } = useToast();

  const onDownloadLot = async () => {
    await downloadPeriod.mutateAsync({ id: periodId, lot });
    showToast({ tone: "info", title: `Descarcare lot ${lot} pregatita.` });
  };

  return (
    <div className="lot-group">
      <div className="lot-group__head">
        <span className="lot-group__title">Lot {lot}</span>
        <Badge variant="neutral">{files.length} fisiere</Badge>
        <span className="lot-group__time">{files[0].created}</span>
        <div className="lot-group__spacer" />
        <Button variant="ghost" size="sm" iconLeft="download" onClick={() => void onDownloadLot()}>
          Descarca lotul
        </Button>
      </div>
      <Card padding={0}>
        {files.map((f) => (
          <FileRow key={f.id} file={f} />
        ))}
      </Card>
    </div>
  );
}
