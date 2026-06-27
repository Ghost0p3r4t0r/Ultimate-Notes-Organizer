import { useState, useCallback, useEffect } from 'react';
import type { ViewMode } from '../components/ViewSwitcher';

const STORAGE_KEY_PREFIX = 'vault_view_prefs_';

interface ViewPreferences {
  mode: ViewMode;
  visibleColumns: string[];
  columnOrder: string[];
}

function loadPrefs(collectionId: string): ViewPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + collectionId);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { mode: 'table', visibleColumns: [], columnOrder: [] };
}

function savePrefs(collectionId: string, prefs: ViewPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + collectionId, JSON.stringify(prefs));
  } catch {}
}

export function useViewPreferences(collectionId: string, allFieldIds: string[]) {
  const [prefs, setPrefs] = useState<ViewPreferences>(() => {
    const loaded = loadPrefs(collectionId);
    if (loaded.visibleColumns.length === 0 && allFieldIds.length > 0) {
      loaded.visibleColumns = allFieldIds;
      loaded.columnOrder = allFieldIds;
    }
    return loaded;
  });

  useEffect(() => {
    savePrefs(collectionId, prefs);
  }, [collectionId, prefs]);

  useEffect(() => {
    if (prefs.visibleColumns.length === 0 && allFieldIds.length > 0) {
      setPrefs((prev) => ({ ...prev, visibleColumns: allFieldIds, columnOrder: allFieldIds }));
    }
  }, [allFieldIds.join(',')]);

  const setMode = useCallback((mode: ViewMode) => {
    setPrefs((prev) => ({ ...prev, mode }));
  }, []);

  const toggleColumn = useCallback((fieldId: string) => {
    setPrefs((prev) => ({
      ...prev,
      visibleColumns: prev.visibleColumns.includes(fieldId)
        ? prev.visibleColumns.filter((id) => id !== fieldId)
        : [...prev.visibleColumns, fieldId],
    }));
  }, []);

  const reorderColumns = useCallback((fieldIds: string[]) => {
    setPrefs((prev) => ({ ...prev, columnOrder: fieldIds }));
  }, []);

  return {
    mode: prefs.mode,
    visibleColumns: prefs.visibleColumns,
    columnOrder: prefs.columnOrder,
    setMode,
    toggleColumn,
    reorderColumns,
  };
}
