import type React from "react";
import { useRef, useState } from "react";
import type { CanvasComponent, ComponentType } from "../../types/builder";
import { ComponentRenderer } from "./ComponentRenderer";

interface CanvasProps {
  components: CanvasComponent[];
  selectedId: string | null;
  previewMode: boolean;
  onSelect: (id: string | null) => void;
  onDrop: (type: ComponentType) => void;
  onDelete: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onMoveComponent: (from: number, to: number) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  components,
  selectedId,
  previewMode,
  onSelect,
  onDrop,
  onDelete,
  onTextChange,
  onMoveComponent,
}) => {
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragSourceIndex = useRef<number | null>(null);
  const dragSourceId = useRef<string | null>(null);

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.types.includes("componenttype");
    if (componentType) setIsDragOverCanvas(true);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCanvas(false);
    setDragOverIndex(null);
    const type = e.dataTransfer.getData("componentType") as ComponentType;
    if (type) {
      onDrop(type);
    } else if (dragSourceIndex.current !== null && dragOverIndex !== null) {
      const from = dragSourceIndex.current;
      const to = dragOverIndex;
      if (from !== to) onMoveComponent(from, to);
    }
    dragSourceIndex.current = null;
    dragSourceId.current = null;
  };

  const handleCanvasDragLeave = () => {
    setIsDragOverCanvas(false);
  };

  const handleComponentDragStart = (id: string, index: number) => {
    dragSourceIndex.current = index;
    dragSourceId.current = id;
  };

  const handleComponentDragOver = (index: number) => {
    if (dragSourceId.current) {
      setDragOverIndex(index);
    }
  };

  const handleComponentDrop = (toIndex: number) => {
    if (
      dragSourceIndex.current !== null &&
      dragSourceIndex.current !== toIndex
    ) {
      onMoveComponent(dragSourceIndex.current, toIndex);
    }
    dragSourceIndex.current = null;
    dragSourceId.current = null;
    setDragOverIndex(null);
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: canvas click-to-deselect is supplemental
    <div
      className="flex-1 overflow-auto"
      style={{ backgroundColor: previewMode ? "#ffffff" : "#EEF2F7" }}
      onClick={() => onSelect(null)}
    >
      <div
        className={`relative transition-all ${
          previewMode
            ? "w-full min-h-screen"
            : "mx-auto my-8 bg-white shadow-xl rounded-sm min-h-[600px] relative"
        }`}
        style={previewMode ? {} : { width: "960px", minWidth: "600px" }}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
        onDragLeave={handleCanvasDragLeave}
      >
        {/* Drop highlight overlay */}
        {isDragOverCanvas && !previewMode && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50/30 rounded pointer-events-none z-10" />
        )}

        {components.length === 0 && !previewMode ? (
          <div className="flex flex-col items-center justify-center h-[500px] text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium text-lg">
              Drop components here to start building
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Drag elements from the left sidebar onto this canvas
            </p>
          </div>
        ) : (
          <div className="relative">
            {components.map((comp, i) => (
              <ComponentRenderer
                key={comp.id}
                component={comp}
                index={i}
                isSelected={comp.id === selectedId}
                previewMode={previewMode}
                onSelect={onSelect}
                onDelete={onDelete}
                onTextChange={onTextChange}
                onDragStart={handleComponentDragStart}
                onDragOver={handleComponentDragOver}
                onDrop={handleComponentDrop}
                isDragOver={
                  dragOverIndex === i && dragSourceId.current !== null
                }
              />
            ))}
            {/* Drop zone at end */}
            {!previewMode && (
              <div
                className={`h-12 flex items-center justify-center text-slate-400 text-sm border-2 border-dashed transition-colors ${
                  isDragOverCanvas
                    ? "border-blue-300 bg-blue-50/20"
                    : "border-transparent"
                }`}
              >
                {isDragOverCanvas && "Drop here"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
