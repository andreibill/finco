import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Selectia de fisiere pentru actiuni in masa. Context local feature-ului: paginile
// care vor selectie il furnizeaza (Biblioteca client); cele care nu, primesc
// valoarea implicita dezactivata, deci FileRow/FileTable/LotGroup raman neschimbate.
type FileSelectionValue = {
  selectable: boolean;
  selected: Set<string>;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  setMany: (ids: string[], on: boolean) => void;
  clear: () => void;
};

const DEFAULT: FileSelectionValue = {
  selectable: false,
  selected: new Set(),
  isSelected: () => false,
  toggle: () => {},
  setMany: () => {},
  clear: () => {},
};

const FileSelectionContext = createContext<FileSelectionValue>(DEFAULT);

export function useFileSelection() {
  return useContext(FileSelectionContext);
}

export function FileSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const isSelected = useCallback((id: string) => selected.has(id), [selected]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const setMany = useCallback((ids: string[], on: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  const value = useMemo(
    () => ({ selectable: true, selected, isSelected, toggle, setMany, clear }),
    [selected, isSelected, toggle, setMany, clear],
  );

  return <FileSelectionContext.Provider value={value}>{children}</FileSelectionContext.Provider>;
}
