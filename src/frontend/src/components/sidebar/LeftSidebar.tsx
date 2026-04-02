import type React from "react";
import { useState } from "react";
import type { ComponentType } from "../../types/builder";

interface ComponentItem {
  type: ComponentType;
  label: string;
  icon: string; // path d
}

const groups: { label: string; items: ComponentItem[] }[] = [
  {
    label: "Basic",
    items: [
      { type: "heading", label: "Heading", icon: "M4 6h16M4 12h10M4 18h6" },
      { type: "text", label: "Text", icon: "M4 6h16M4 10h16M4 14h10M4 18h8" },
      { type: "button", label: "Button", icon: "M3 9h18v6H3zM7 12h10" },
      {
        type: "link",
        label: "Link",
        icon: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
      },
      {
        type: "image",
        label: "Image",
        icon: "M21 15l-5-5L5 20M3 3h18v18H3zM8.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z",
      },
    ],
  },
  {
    label: "Layout",
    items: [
      {
        type: "section",
        label: "Section",
        icon: "M3 5h18M3 9h18M3 19h18M3 15h18",
      },
      { type: "container", label: "Container", icon: "M3 3h18v18H3z" },
      { type: "columns", label: "Columns", icon: "M3 3h7v18H3zM14 3h7v18h-7z" },
      { type: "divider", label: "Divider", icon: "M4 12h16" },
    ],
  },
  {
    label: "Media",
    items: [
      {
        type: "video",
        label: "Video",
        icon: "M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.94L15 14M3 8h12v8H3z",
      },
    ],
  },
  {
    label: "Components",
    items: [
      {
        type: "navbar",
        label: "Navbar",
        icon: "M3 6h18M3 12h6M3 18h6M13 12h8M13 18h8",
      },
      {
        type: "footer",
        label: "Footer",
        icon: "M3 18h18M3 14h18M7 10h10M9 6h6",
      },
      { type: "card", label: "Card", icon: "M3 5h18v4H3zM3 11h18v8H3z" },
      {
        type: "form",
        label: "Form",
        icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
      },
    ],
  },
];

const navIcons = [
  {
    id: "elements",
    label: "Elements",
    icon: "M4 6h16M4 10h16M4 14h16M4 18h16",
  },
  {
    id: "layers",
    label: "Layers",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    id: "pages",
    label: "Pages",
    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  },
];

export const LeftSidebar: React.FC = () => {
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    new Set(groups.map((g) => g.label)),
  );
  const [activeTab, setActiveTab] = useState("elements");

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData("componentType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      className="flex h-full"
      style={{
        width: "268px",
        minWidth: "268px",
        backgroundColor: "#0F172A",
        borderRight: "1px solid #1E293B",
      }}
    >
      {/* Icon rail */}
      <div
        className="flex flex-col items-center py-3 gap-1"
        style={{ width: "44px", borderRight: "1px solid #1E293B" }}
      >
        {navIcons.map((nav) => (
          <button
            key={nav.id}
            type="button"
            onClick={() => setActiveTab(nav.id)}
            title={nav.label}
            aria-label={nav.label}
            className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${
              activeTab === nav.id
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={nav.icon} />
            </svg>
          </button>
        ))}
      </div>

      {/* Main panel */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 pt-3 pb-1">
          <p
            className="text-xs font-semibold tracking-widest"
            style={{ color: "#9CA3AF" }}
          >
            ELEMENTS
          </p>
        </div>

        {groups.map((group) => (
          <div key={group.label}>
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-slate-800 transition-colors"
              style={{ color: "#9CA3AF" }}
            >
              <span>{group.label}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                style={{
                  transform: openGroups.has(group.label)
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
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

            {openGroups.has(group.label) && (
              <div className="grid grid-cols-2 gap-2 px-3 pb-3">
                {group.items.map((item) => (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.type)}
                    // biome-ignore lint/a11y/useSemanticElements: draggable tiles need div
                    aria-label={`Add ${item.label}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        /* keyboard add */
                      }
                    }}
                    className="flex flex-col items-center justify-center gap-1.5 rounded-lg cursor-grab active:cursor-grabbing select-none transition-colors hover:border-blue-500"
                    style={{
                      backgroundColor: "#1E293B",
                      border: "1px solid #334155",
                      padding: "10px 8px",
                      minHeight: "68px",
                      color: "#E2E8F0",
                    }}
                    title={`Drag to add ${item.label}`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d={item.icon} />
                    </svg>
                    <span className="text-xs font-medium text-center leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
