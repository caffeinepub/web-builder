import type React from "react";

interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  previewMode: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onTogglePreview: () => void;
  onExportHTML: () => void;
  onSave: () => void;
  saving?: boolean;
}

function ToolBtn({
  onClick,
  disabled,
  title,
  active,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`flex items-center justify-center rounded transition-colors px-2.5 py-1.5 text-sm font-medium ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : active
            ? "bg-blue-600 text-white"
            : "text-slate-300 hover:text-white hover:bg-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

export const Toolbar: React.FC<ToolbarProps> = ({
  canUndo,
  canRedo,
  previewMode,
  onUndo,
  onRedo,
  onTogglePreview,
  onExportHTML,
  onSave,
  saving,
}) => {
  return (
    <div
      className="flex items-center justify-between px-4 shrink-0"
      style={{
        height: "56px",
        background: "linear-gradient(to bottom, #0B0F14, #111827)",
        borderBottom: "1px solid #1E293B",
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="font-bold text-white text-sm tracking-tight">
            SiteBuilder
          </span>
        </div>
        <div className="flex items-center gap-0.5 ml-2">
          {["File", "Edit", "Add"].map((item) => (
            <button
              key={item}
              type="button"
              className="px-2.5 py-1 text-xs rounded transition-colors hover:bg-slate-700"
              style={{ color: "#9CA3AF" }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Viewport toggle */}
      <div
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg"
        style={{ backgroundColor: "#1E293B", border: "1px solid #334155" }}
      >
        {[
          {
            label: "Desktop",
            pathD:
              "M20 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8v2H8v2h8v-2h-4v-2h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 12H5V5h14v10z",
            active: true,
          },
          {
            label: "Tablet",
            pathD:
              "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
            active: false,
          },
          {
            label: "Mobile",
            pathD:
              "M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zm-5 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z",
            active: false,
          },
        ].map((v) => (
          <button
            key={v.label}
            type="button"
            title={v.label}
            aria-label={v.label}
            className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
              v.active
                ? "bg-blue-600 text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d={v.pathD} />
            </svg>
          </button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        <ToolBtn onClick={onUndo} disabled={!canUndo} title="Undo">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M3 7v6h6M3.51 15a9 9 0 1 0 .49-4.65" />
          </svg>
          <span className="ml-1 text-xs">Undo</span>
        </ToolBtn>
        <ToolBtn onClick={onRedo} disabled={!canRedo} title="Redo">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M21 7v6h-6M20.49 15a9 9 0 1 1-.49-4.65" />
          </svg>
          <span className="ml-1 text-xs">Redo</span>
        </ToolBtn>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: "#334155" }} />

        <ToolBtn
          onClick={onTogglePreview}
          active={previewMode}
          title={previewMode ? "Switch to Edit mode" : "Switch to Preview mode"}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            {previewMode ? (
              <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </>
            ) : (
              <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
          <span className="ml-1 text-xs">
            {previewMode ? "Edit" : "Preview"}
          </span>
        </ToolBtn>

        <ToolBtn onClick={onExportHTML} title="Export HTML">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          <span className="ml-1 text-xs">Export</span>
        </ToolBtn>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60"
        >
          {saving ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-spin"
              aria-hidden="true"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          )}
          Save
        </button>
      </div>
    </div>
  );
};
