import { Card, Badge, Button, useToast } from "@components";
import { FileRow } from "@features/private/PeriodDetail/FileRow";
import { useFileSelection } from "@features/private/PeriodDetail/FileSelectionContext";
import { useDownloadPeriod } from "@hooks/usePeriods";
import { formatDateTime } from "@utils/format";
import type { FileItem } from "@types";
import "./LotGroup.css";

export type LotGroupProps = {
  lot: number;
  files: FileItem[];
  periodId: string;
};

export function LotGroup({ lot, files, periodId }: LotGroupProps) {
  const downloadPeriod = useDownloadPeriod();
  const sel = useFileSelection();
  const { showToast } = useToast();

  const onDownloadLot = async () => {
    await downloadPeriod.mutateAsync({ id: periodId, lot });
    showToast({ tone: "info", title: `Descarcare lot ${lot} pregatita.` });
  };

  // Selectie pe lot: doar fisierele active ale lotului.
  const lotActiveIds = files.filter((f) => f.activ).map((f) => f.id);
  const lotSelectedCount = lotActiveIds.filter((id) => sel.isSelected(id)).length;
  const allLotSelected = lotActiveIds.length > 0 && lotSelectedCount === lotActiveIds.length;

  return (
    <div className="lot-group">
      <div className="lot-group__head">
        {/* Checkbox-ul lotului apare doar dupa ce un fisier din lot e selectat. */}
        {sel.selectable && lotSelectedCount > 0 && (
          <input
            type="checkbox"
            className="lot-group__check"
            checked={allLotSelected}
            onChange={() => sel.setMany(lotActiveIds, !allLotSelected)}
            aria-label={`Selecteaza toate fisierele din lotul ${lot}`}
          />
        )}
        <span className="lot-group__title">Lot {lot}</span>
        <Badge variant="neutral">{files.length} fisiere</Badge>
        <span className="lot-group__time">{formatDateTime(files[0].created_at)}</span>
        <div className="lot-group__spacer" />
        <Button variant="ghost" size="sm" iconLeft="download" onClick={() => void onDownloadLot()}>
          Descarca lotul
        </Button>
      </div>
      <Card padding={0}>
        {files.map((f) => (
          <FileRow key={f.id} file={f} periodId={periodId} />
        ))}
      </Card>
    </div>
  );
}
