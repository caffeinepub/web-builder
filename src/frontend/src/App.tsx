import { useCallback, useEffect, useState } from "react";
import { Canvas } from "./components/canvas/Canvas";
import { LeftSidebar } from "./components/sidebar/LeftSidebar";
import { RightSidebar } from "./components/sidebar/RightSidebar";
import { Toolbar } from "./components/toolbar/Toolbar";
import { useActor } from "./hooks/useActor";
import { useBuilder } from "./hooks/useBuilder";
import type { ComponentType } from "./types/builder";

export default function App() {
  const { actor } = useActor();
  const {
    state,
    selectedComponent,
    canUndo,
    canRedo,
    addComponent,
    selectComponent,
    updateProps,
    moveComponent,
    deleteComponent,
    undo,
    redo,
    togglePreview,
    loadState,
    exportHTML,
  } = useBuilder();

  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    if (!actor || loaded) return;
    setLoaded(true);
    actor
      .loadPage()
      .then((result) => {
        if (result) {
          try {
            const parsed = JSON.parse(result);
            if (Array.isArray(parsed)) loadState(parsed);
          } catch {
            // ignore parse error
          }
        }
      })
      .catch(() => {});
  }, [actor, loaded, loadState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        const active = document.activeElement;
        if (
          active &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            (active as HTMLElement).isContentEditable)
        )
          return;
        if (state.selectedId) deleteComponent(state.selectedId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, deleteComponent, state.selectedId]);

  const handleSave = useCallback(async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.savePage(JSON.stringify(state.components));
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }, [actor, state.components]);

  const handleDrop = useCallback(
    (type: ComponentType) => {
      addComponent(type);
    },
    [addComponent],
  );

  const handleTextChange = useCallback(
    (id: string, text: string) => {
      updateProps(id, { text });
    },
    [updateProps],
  );

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "#0B0F14" }}
    >
      <Toolbar
        canUndo={canUndo}
        canRedo={canRedo}
        previewMode={state.previewMode}
        onUndo={undo}
        onRedo={redo}
        onTogglePreview={togglePreview}
        onExportHTML={exportHTML}
        onSave={handleSave}
        saving={saving}
      />
      <div className="flex flex-1 overflow-hidden">
        {!state.previewMode && <LeftSidebar />}
        <Canvas
          components={state.components}
          selectedId={state.selectedId}
          previewMode={state.previewMode}
          onSelect={selectComponent}
          onDrop={handleDrop}
          onDelete={deleteComponent}
          onTextChange={handleTextChange}
          onMoveComponent={moveComponent}
        />
        {!state.previewMode && (
          <RightSidebar component={selectedComponent} onChange={updateProps} />
        )}
      </div>
    </div>
  );
}
