import { useState } from "react";
import { useParams } from "react-router-dom";
import { SplitCard, useToast } from "@components";
import { HeroPanel } from "@features/public/Upload/HeroPanel";
import { UploadRightPanel } from "@features/public/Upload/UploadRightPanel";
import { ExpiredPanel } from "@features/public/Upload/ExpiredPanel";
import { SuccessPanel } from "@features/public/Upload/SuccessPanel";
import { usePublicUploadContext, useUploadFiles } from "@hooks/usePublic";
import { UPLOAD_ACCEPT, UPLOAD_MAX_BYTES } from "@constants/upload";
import "./Upload.css";

export function Upload() {
  const { token = "" } = useParams();
  const { showToast } = useToast();
  const ctx = usePublicUploadContext(token);
  const uploadMutation = useUploadFiles(token);

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const uploading = progress > 0 && progress < 100;
  const done = progress === 100;

  // Validari rapide pe client (nu inlocuiesc backend-ul): extensie .zip, 50 MB,
  // un singur fisier. Eroarea apare ca Toast tone err.
  const pickFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(UPLOAD_ACCEPT)) {
      showToast({ tone: "err", title: "Fisier invalid", body: "Selectati o arhiva ZIP." });
      return;
    }
    if (f.size > UPLOAD_MAX_BYTES) {
      showToast({ tone: "err", title: "Fisier prea mare", body: "Arhiva depaseste limita de 50 MB." });
      return;
    }
    setFile(f);
  };

  const startUpload = () => {
    if (!file || uploading || done) return;
    void uploadMutation.mutateAsync().catch(() => {
      /* in mock nu esueaza; eroarea reala ar opri progresul */
    });
    setProgress(1);
    const tick = () => {
      setProgress((p) => {
        if (p >= 100) return p;
        const next = p + Math.max(2, Math.round((100 - p) * 0.16));
        if (next >= 100) return 100;
        setTimeout(tick, 90);
        return next;
      });
    };
    setTimeout(tick, 200);
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
  };

  if (ctx.isLoading) {
    return <div className="upload-page__loading">Se incarca...</div>;
  }
  if (ctx.isError || !ctx.data) {
    return <div className="upload-page__loading">Link invalid sau indisponibil.</div>;
  }
  if (ctx.data.expired) {
    return <ExpiredPanel context={ctx.data} />;
  }
  if (done && file) {
    return <SuccessPanel file={file} context={ctx.data} onAgain={reset} />;
  }

  return (
    <SplitCard hero={<HeroPanel context={ctx.data} />}>
      <UploadRightPanel
        context={ctx.data}
        file={file}
        progress={progress}
        uploading={uploading}
        done={done}
        onPick={pickFile}
        onReset={reset}
        onUpload={startUpload}
      />
    </SplitCard>
  );
}
