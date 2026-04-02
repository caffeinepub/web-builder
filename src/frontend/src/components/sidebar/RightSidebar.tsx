import type React from "react";
import { useState } from "react";
import type { CanvasComponent, ComponentProps } from "../../types/builder";

interface RightSidebarProps {
  component: CanvasComponent | null;
  onChange: (id: string, props: Partial<ComponentProps>) => void;
}

function SectionHeader({
  title,
  open,
  onToggle,
}: { title: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold tracking-widest hover:bg-slate-800 transition-colors"
      style={{ color: "#9CA3AF", borderBottom: "1px solid #1E293B" }}
    >
      <span>{title}</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        style={{
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.15s",
        }}
      >
        <path
          d="M2 4l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

let inputIdCounter = 0;
function useInputId() {
  const [id] = useState(() => `rsb-input-${++inputIdCounter}`);
  return id;
}

function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 9999,
  unit = "px",
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}) {
  const id = useInputId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs" style={{ color: "#64748B" }}>
        {label}
      </label>
      <div className="flex items-center gap-1">
        <input
          id={id}
          type="number"
          value={value ?? ""}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 rounded text-xs px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
          style={{
            backgroundColor: "#1E293B",
            border: "1px solid #334155",
            color: "#E2E8F0",
          }}
        />
        {unit && (
          <span className="text-xs" style={{ color: "#64748B" }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  const [hex, setHex] = useState(value ?? "#000000");
  const id = useInputId();

  const handleHexChange = (v: string) => {
    setHex(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs" style={{ color: "#64748B" }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <label
          className="relative cursor-pointer"
          aria-label={`Pick ${label} with color picker`}
        >
          <input
            type="color"
            value={value ?? "#000000"}
            onChange={(e) => {
              setHex(e.target.value);
              onChange(e.target.value);
            }}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
          <div
            className="w-7 h-7 rounded border"
            style={{
              backgroundColor: value ?? "#000000",
              borderColor: "#334155",
            }}
          />
        </label>
        <input
          id={id}
          type="text"
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          className="flex-1 rounded text-xs px-2 py-1.5 outline-none font-mono focus:ring-1 focus:ring-blue-500"
          style={{
            backgroundColor: "#1E293B",
            border: "1px solid #334155",
            color: "#E2E8F0",
          }}
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | undefined;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const id = useInputId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs" style={{ color: "#64748B" }}>
        {label}
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="rounded text-xs px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
        style={{
          backgroundColor: "#1E293B",
          border: "1px solid #334155",
          color: "#E2E8F0",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  component,
  onChange,
}) => {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set([
      "Content",
      "Typography",
      "Background",
      "Spacing",
      "Border",
      "Dimensions",
    ]),
  );

  const toggleSection = (s: string) => {
    setOpenSections((prev) => {
      const n = new Set(prev);
      n.has(s) ? n.delete(s) : n.add(s);
      return n;
    });
  };

  if (!component) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          width: "280px",
          minWidth: "280px",
          backgroundColor: "#0F172A",
          borderLeft: "1px solid #1E293B",
        }}
      >
        <div className="text-center px-6">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: "#64748B" }}>
            No element selected
          </p>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>
            Click an element on the canvas to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const p = component.props;
  const update = (props: Partial<ComponentProps>) =>
    onChange(component.id, props);
  const hasText = [
    "heading",
    "text",
    "button",
    "link",
    "navbar",
    "footer",
    "card",
  ].includes(component.type);
  const hasTypography = [
    "heading",
    "text",
    "button",
    "link",
    "navbar",
    "footer",
  ].includes(component.type);
  const hasImage = component.type === "image";
  const hasBackground = [
    "section",
    "container",
    "navbar",
    "footer",
    "card",
    "form",
    "columns",
    "button",
  ].includes(component.type);

  return (
    <div
      className="flex flex-col overflow-y-auto"
      style={{
        width: "280px",
        minWidth: "280px",
        backgroundColor: "#0F172A",
        borderLeft: "1px solid #1E293B",
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: "#1E293B" }}>
        <p
          className="text-xs font-semibold tracking-widest"
          style={{ color: "#9CA3AF" }}
        >
          STYLE
        </p>
        <p className="text-sm font-medium mt-0.5" style={{ color: "#E2E8F0" }}>
          {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
        </p>
      </div>

      {/* Content Section */}
      {(hasText || hasImage) && (
        <div>
          <SectionHeader
            title="CONTENT"
            open={openSections.has("Content")}
            onToggle={() => toggleSection("Content")}
          />
          {openSections.has("Content") && (
            <div className="px-4 py-3 flex flex-col gap-3">
              {hasText && (
                <TextareaField
                  label="Text"
                  value={p.text ?? ""}
                  onChange={(v) => update({ text: v })}
                />
              )}
              {hasImage && (
                <>
                  <TextField
                    label="Image URL"
                    value={p.src ?? ""}
                    onChange={(v) => update({ src: v })}
                  />
                  <TextField
                    label="Alt Text"
                    value={p.alt ?? ""}
                    onChange={(v) => update({ alt: v })}
                  />
                </>
              )}
              {component.type === "link" && (
                <TextField
                  label="URL"
                  value={p.href ?? ""}
                  onChange={(v) => update({ href: v })}
                />
              )}
              {component.type === "heading" && (
                <SelectInput
                  label="Heading Level"
                  value={String(p.level ?? 1)}
                  options={[1, 2, 3, 4, 5, 6].map((n) => ({
                    value: String(n),
                    label: `H${n}`,
                  }))}
                  onChange={(v) =>
                    update({ level: Number(v) as 1 | 2 | 3 | 4 | 5 | 6 })
                  }
                />
              )}
              {component.type === "columns" && (
                <SelectInput
                  label="Columns"
                  value={String(p.columns ?? 2)}
                  options={[
                    { value: "2", label: "2 columns" },
                    { value: "3", label: "3 columns" },
                    { value: "4", label: "4 columns" },
                  ]}
                  onChange={(v) => update({ columns: Number(v) })}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Typography */}
      {hasTypography && (
        <div>
          <SectionHeader
            title="TYPOGRAPHY"
            open={openSections.has("Typography")}
            onToggle={() => toggleSection("Typography")}
          />
          {openSections.has("Typography") && (
            <div className="px-4 py-3 flex flex-col gap-3">
              <NumberInput
                label="Font Size"
                value={p.fontSize}
                onChange={(v) => update({ fontSize: v })}
                min={8}
                max={200}
              />
              <SelectInput
                label="Font Weight"
                value={p.fontWeight ?? "400"}
                options={[
                  { value: "300", label: "Light (300)" },
                  { value: "400", label: "Regular (400)" },
                  { value: "500", label: "Medium (500)" },
                  { value: "600", label: "Semibold (600)" },
                  { value: "700", label: "Bold (700)" },
                  { value: "800", label: "Extra Bold (800)" },
                  { value: "900", label: "Black (900)" },
                ]}
                onChange={(v) => update({ fontWeight: v })}
              />
              <div className="flex flex-col gap-1">
                <span className="text-xs" style={{ color: "#64748B" }}>
                  Text Align
                </span>
                <div className="flex gap-1">
                  {(["left", "center", "right"] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => update({ textAlign: align })}
                      aria-label={`Align ${align}`}
                      className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                        p.textAlign === align
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:bg-slate-700"
                      }`}
                      style={{ border: "1px solid #334155" }}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <ColorInput
                label="Text Color"
                value={p.color}
                onChange={(v) => update({ color: v })}
              />
            </div>
          )}
        </div>
      )}

      {/* Background */}
      {hasBackground && (
        <div>
          <SectionHeader
            title="BACKGROUND"
            open={openSections.has("Background")}
            onToggle={() => toggleSection("Background")}
          />
          {openSections.has("Background") && (
            <div className="px-4 py-3">
              <ColorInput
                label="Background Color"
                value={p.backgroundColor}
                onChange={(v) => update({ backgroundColor: v })}
              />
            </div>
          )}
        </div>
      )}

      {/* Spacing */}
      <div>
        <SectionHeader
          title="SPACING"
          open={openSections.has("Spacing")}
          onToggle={() => toggleSection("Spacing")}
        />
        {openSections.has("Spacing") && (
          <div className="px-4 py-3 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <NumberInput
                label="Top"
                value={p.paddingTop}
                onChange={(v) => update({ paddingTop: v })}
              />
              <NumberInput
                label="Bottom"
                value={p.paddingBottom}
                onChange={(v) => update({ paddingBottom: v })}
              />
              <NumberInput
                label="Left"
                value={p.paddingLeft}
                onChange={(v) => update({ paddingLeft: v })}
              />
              <NumberInput
                label="Right"
                value={p.paddingRight}
                onChange={(v) => update({ paddingRight: v })}
              />
            </div>
            {component.type === "columns" && (
              <NumberInput
                label="Gap"
                value={p.gap}
                onChange={(v) => update({ gap: v })}
              />
            )}
          </div>
        )}
      </div>

      {/* Border */}
      <div>
        <SectionHeader
          title="BORDER"
          open={openSections.has("Border")}
          onToggle={() => toggleSection("Border")}
        />
        {openSections.has("Border") && (
          <div className="px-4 py-3 flex flex-col gap-3">
            <NumberInput
              label="Border Radius"
              value={p.borderRadius}
              onChange={(v) => update({ borderRadius: v })}
            />
            <NumberInput
              label="Border Width"
              value={p.borderWidth}
              onChange={(v) => update({ borderWidth: v })}
            />
            <ColorInput
              label="Border Color"
              value={p.borderColor ?? "#E5E7EB"}
              onChange={(v) => update({ borderColor: v })}
            />
          </div>
        )}
      </div>

      {/* Dimensions */}
      <div>
        <SectionHeader
          title="DIMENSIONS"
          open={openSections.has("Dimensions")}
          onToggle={() => toggleSection("Dimensions")}
        />
        {openSections.has("Dimensions") && (
          <div className="px-4 py-3 flex flex-col gap-3">
            <TextField
              label="Width"
              value={p.width ?? ""}
              onChange={(v) => update({ width: v })}
              placeholder="100%, 200px, auto"
            />
            <TextField
              label="Height"
              value={p.height ?? ""}
              onChange={(v) => update({ height: v })}
              placeholder="auto, 200px"
            />
          </div>
        )}
      </div>
    </div>
  );
};

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useInputId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs" style={{ color: "#64748B" }}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded text-xs px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
        style={{
          backgroundColor: "#1E293B",
          border: "1px solid #334155",
          color: "#E2E8F0",
        }}
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useInputId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs" style={{ color: "#64748B" }}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="rounded text-xs px-2 py-1.5 outline-none resize-y focus:ring-1 focus:ring-blue-500"
        style={{
          backgroundColor: "#1E293B",
          border: "1px solid #334155",
          color: "#E2E8F0",
        }}
      />
    </div>
  );
}
