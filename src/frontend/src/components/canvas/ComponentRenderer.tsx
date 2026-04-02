import type React from "react";
import { useCallback, useRef, useState } from "react";
import type { CanvasComponent, ComponentType } from "../../types/builder";

interface ComponentRendererProps {
  component: CanvasComponent;
  isSelected: boolean;
  previewMode: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onDragStart: (id: string, index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: (index: number) => void;
  index: number;
  isDragOver?: boolean;
}

function getComponentLabel(type: ComponentType): string {
  const labels: Record<ComponentType, string> = {
    heading: "Heading",
    text: "Text",
    image: "Image",
    button: "Button",
    link: "Link",
    section: "Section",
    container: "Container",
    columns: "Columns",
    divider: "Divider",
    video: "Video",
    navbar: "Navbar",
    footer: "Footer",
    card: "Card",
    form: "Form",
  };
  return labels[type] ?? type;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected,
  previewMode,
  onSelect,
  onDelete,
  onTextChange,
  onDragStart,
  onDragOver,
  onDrop,
  index,
  isDragOver,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textRef = useRef<HTMLElement>(null);
  const p = component.props;

  const buildStyle = useCallback(
    (): React.CSSProperties => ({
      color: p.color ?? undefined,
      backgroundColor: p.backgroundColor ?? undefined,
      fontSize: p.fontSize ? `${p.fontSize}px` : undefined,
      fontWeight: p.fontWeight ?? undefined,
      textAlign: p.textAlign ?? undefined,
      borderRadius: p.borderRadius ? `${p.borderRadius}px` : undefined,
      paddingTop: p.paddingTop !== undefined ? `${p.paddingTop}px` : undefined,
      paddingBottom:
        p.paddingBottom !== undefined ? `${p.paddingBottom}px` : undefined,
      paddingLeft:
        p.paddingLeft !== undefined ? `${p.paddingLeft}px` : undefined,
      paddingRight:
        p.paddingRight !== undefined ? `${p.paddingRight}px` : undefined,
      width: p.width ?? undefined,
      height: p.height ?? undefined,
      border:
        p.borderWidth && p.borderColor
          ? `${p.borderWidth}px solid ${p.borderColor}`
          : undefined,
    }),
    [p],
  );

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (previewMode) return;
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.focus();
        const range = document.createRange();
        range.selectNodeContents(textRef.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (textRef.current) {
      onTextChange(component.id, textRef.current.innerText);
    }
  };

  const style = buildStyle();
  const level = p.level ?? 1;

  let content: React.ReactNode;

  switch (component.type) {
    case "heading": {
      const Tag = `h${level}` as React.ElementType;
      content = (
        <Tag
          ref={textRef as React.RefObject<HTMLHeadingElement>}
          style={style}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={handleBlur}
          onDoubleClick={handleDoubleClick}
          className="outline-none w-full"
        >
          {p.text}
        </Tag>
      );
      break;
    }
    case "text":
      content = (
        <p
          ref={textRef as React.RefObject<HTMLParagraphElement>}
          style={style}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={handleBlur}
          onDoubleClick={handleDoubleClick}
          className="outline-none w-full"
        >
          {p.text}
        </p>
      );
      break;
    case "button":
      content = (
        <div
          style={{
            paddingTop: style.paddingTop,
            paddingBottom: style.paddingBottom,
          }}
        >
          <button
            type="button"
            ref={textRef as React.RefObject<HTMLButtonElement>}
            style={{
              ...style,
              paddingTop: undefined,
              paddingBottom: undefined,
              cursor: previewMode ? "pointer" : "default",
              display: "inline-block",
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={handleBlur}
            onDoubleClick={handleDoubleClick}
            className="outline-none"
          >
            {p.text}
          </button>
        </div>
      );
      break;
    case "link":
      content = (
        <a
          href={previewMode ? (p.href ?? "#") : undefined}
          style={style}
          className="underline cursor-pointer"
        >
          {p.text}
        </a>
      );
      break;
    case "image":
      content = (
        <img
          src={p.src ?? "https://placehold.co/800x400"}
          alt={p.alt ?? ""}
          style={style}
          className="block"
        />
      );
      break;
    case "section":
      content = (
        <section style={style} className="w-full">
          {!previewMode && (
            <div
              className="text-gray-400 text-center py-4 text-sm"
              style={{ opacity: 0.5 }}
            >
              Section — drop components inside (coming soon)
            </div>
          )}
        </section>
      );
      break;
    case "container":
      content = (
        <div style={{ ...style, maxWidth: "1100px", margin: "0 auto" }}>
          {!previewMode && (
            <div
              className="text-gray-400 text-center py-4 text-sm"
              style={{ opacity: 0.5 }}
            >
              Container
            </div>
          )}
        </div>
      );
      break;
    case "columns": {
      const cols = p.columns ?? 2;
      content = (
        <div
          style={{
            ...style,
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: p.gap ? `${p.gap}px` : "24px",
          }}
        >
          {Array.from({ length: cols }, (_, i) => `col-${i}`).map((colKey) => (
            <div
              key={colKey}
              className="border-2 border-dashed border-slate-300 rounded-lg p-4 min-h-[80px] flex items-center justify-center text-slate-400 text-sm"
            >
              Column {Number(colKey.split("-")[1]) + 1}
            </div>
          ))}
        </div>
      );
      break;
    }
    case "divider":
      content = (
        <hr
          style={{
            border: "none",
            borderTop: `1px solid ${p.color ?? "#E5E7EB"}`,
            marginTop: `${p.marginTop ?? 16}px`,
            marginBottom: `${p.marginBottom ?? 16}px`,
          }}
        />
      );
      break;
    case "video":
      content = (
        <div
          style={{
            ...style,
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
          }}
        >
          <iframe
            src={p.src ?? ""}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: `${p.borderRadius ?? 8}px`,
            }}
            allowFullScreen
            title="Embedded video"
          />
        </div>
      );
      break;
    case "navbar":
      content = (
        <nav style={style} className="flex items-center justify-between">
          <span className="font-bold text-lg">{p.text ?? "SiteName"}</span>
          <div className="flex gap-6">
            <a
              href="/"
              style={{
                color: p.color ?? "#fff",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Home
            </a>
            <a
              href="/features"
              style={{
                color: p.color ?? "#fff",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Features
            </a>
            <a
              href="/pricing"
              style={{
                color: p.color ?? "#fff",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Pricing
            </a>
          </div>
        </nav>
      );
      break;
    case "footer":
      content = (
        <footer style={style} className="text-center">
          <p>{p.text ?? "© 2024 Your Company. All rights reserved."}</p>
        </footer>
      );
      break;
    case "card":
      content = (
        <div style={style}>
          <h3
            style={{
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "8px",
              color: "#111827",
            }}
          >
            {p.text ?? "Card Title"}
          </h3>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            Card description goes here. Add your content.
          </p>
        </div>
      );
      break;
    case "form":
      content = (
        <div style={style}>
          <h3
            style={{
              fontWeight: "700",
              fontSize: "20px",
              marginBottom: "20px",
              color: "#111827",
            }}
          >
            Contact Us
          </h3>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor={`form-name-${component.id}`}
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "600",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              Name
            </label>
            <input
              id={`form-name-${component.id}`}
              type="text"
              placeholder="Your name"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              readOnly={!previewMode}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor={`form-email-${component.id}`}
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "600",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              Email
            </label>
            <input
              id={`form-email-${component.id}`}
              type="email"
              placeholder="your@email.com"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              readOnly={!previewMode}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor={`form-msg-${component.id}`}
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "600",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              Message
            </label>
            <textarea
              id={`form-msg-${component.id}`}
              rows={4}
              placeholder="Your message"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
              readOnly={!previewMode}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#2563EB",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Send Message
          </button>
        </div>
      );
      break;
    default:
      content = <div>Unknown component</div>;
  }

  if (previewMode) {
    return <>{content}</>;
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: click-to-select is supplemental UI, keyboard selection handled elsewhere
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(component.id, index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver(index);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop(index);
      }}
    >
      {/* Drop indicator above */}
      {isDragOver && (
        <div className="absolute -top-0.5 left-0 right-0 h-1 bg-blue-500 rounded-full z-20 pointer-events-none" />
      )}

      {/* Selection/hover border */}
      <div
        className={`absolute inset-0 pointer-events-none z-10 transition-all ${
          isSelected
            ? "ring-2 ring-blue-500 ring-offset-0"
            : isHovered
              ? "ring-1 ring-blue-300 ring-offset-0"
              : ""
        }`}
      />

      {/* Label pill */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-6 left-0 z-20 flex items-center gap-1 pointer-events-none">
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded">
            {getComponentLabel(component.type)}
          </span>
        </div>
      )}

      {/* Action buttons */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-6 right-0 z-20 flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component.id);
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-xs w-5 h-5 rounded flex items-center justify-center"
            title="Delete component"
            aria-label="Delete component"
          >
            ×
          </button>
        </div>
      )}

      {/* Drag handle */}
      {(isSelected || isHovered) && (
        <div
          className="absolute top-1 left-1 z-20 cursor-grab opacity-60 hover:opacity-100"
          title="Drag to reorder"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="#6B7280"
            aria-hidden="true"
          >
            <circle cx="3" cy="3" r="1" />
            <circle cx="9" cy="3" r="1" />
            <circle cx="3" cy="6" r="1" />
            <circle cx="9" cy="6" r="1" />
            <circle cx="3" cy="9" r="1" />
            <circle cx="9" cy="9" r="1" />
          </svg>
        </div>
      )}

      {content}
    </div>
  );
};
