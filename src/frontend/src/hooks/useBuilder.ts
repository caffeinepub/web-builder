import { useCallback, useReducer } from "react";
import type {
  BuilderState,
  CanvasComponent,
  ComponentProps,
  ComponentType,
} from "../types/builder";

type Action =
  | {
      type: "ADD_COMPONENT";
      payload: { componentType: ComponentType; afterIndex?: number };
    }
  | { type: "SELECT_COMPONENT"; payload: string | null }
  | {
      type: "UPDATE_PROPS";
      payload: { id: string; props: Partial<ComponentProps> };
    }
  | { type: "MOVE_COMPONENT"; payload: { fromIndex: number; toIndex: number } }
  | { type: "DELETE_COMPONENT"; payload: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "TOGGLE_PREVIEW" }
  | { type: "LOAD_STATE"; payload: CanvasComponent[] };

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getDefaultProps(type: ComponentType): ComponentProps {
  switch (type) {
    case "heading":
      return {
        text: "Your Heading",
        fontSize: 32,
        fontWeight: "700",
        color: "#111827",
        textAlign: "left",
        paddingTop: 16,
        paddingBottom: 8,
        paddingLeft: 0,
        paddingRight: 0,
        level: 1,
      };
    case "text":
      return {
        text: "Your text here. Click to edit this paragraph.",
        fontSize: 16,
        color: "#374151",
        textAlign: "left",
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 0,
        paddingRight: 0,
      };
    case "button":
      return {
        text: "Click Me",
        backgroundColor: "#2563EB",
        color: "#FFFFFF",
        borderRadius: 8,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 14,
        fontWeight: "600",
      };
    case "link":
      return { text: "Learn more", color: "#2563EB", href: "#", fontSize: 14 };
    case "image":
      return {
        src: "https://placehold.co/800x400/e2e8f0/94a3b8?text=Image",
        alt: "Image",
        width: "100%",
        borderRadius: 8,
        paddingTop: 8,
        paddingBottom: 8,
      };
    case "section":
      return {
        backgroundColor: "#FFFFFF",
        paddingTop: 60,
        paddingBottom: 60,
        paddingLeft: 40,
        paddingRight: 40,
      };
    case "container":
      return {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,
        width: "100%",
      };
    case "columns":
      return { columns: 2, gap: 24, paddingTop: 16, paddingBottom: 16 };
    case "divider":
      return { color: "#E5E7EB", marginTop: 16, marginBottom: 16 };
    case "video":
      return {
        src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        paddingTop: 8,
        paddingBottom: 8,
      };
    case "navbar":
      return {
        text: "SiteName",
        backgroundColor: "#111827",
        color: "#FFFFFF",
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 24,
        paddingRight: 24,
      };
    case "footer":
      return {
        text: "© 2024 Your Company. All rights reserved.",
        backgroundColor: "#1F2937",
        color: "#9CA3AF",
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: "center",
        fontSize: 14,
      };
    case "card":
      return {
        text: "Card Title",
        backgroundColor: "#FFFFFF",
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 24,
        paddingRight: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
      };
    case "form":
      return {
        backgroundColor: "#FFFFFF",
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 32,
        paddingRight: 32,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
      };
    default:
      return {};
  }
}

function createComponent(type: ComponentType): CanvasComponent {
  return { id: generateId(), type, props: getDefaultProps(type) };
}

function pushHistory(
  state: BuilderState,
  components: CanvasComponent[],
): BuilderState {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(components);
  return {
    ...state,
    components,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

function updateComponentById(
  components: CanvasComponent[],
  id: string,
  updater: (c: CanvasComponent) => CanvasComponent,
): CanvasComponent[] {
  return components.map((c) => (c.id === id ? updater(c) : c));
}

function deleteById(
  components: CanvasComponent[],
  id: string,
): CanvasComponent[] {
  return components.filter((c) => c.id !== id);
}

const initialState: BuilderState = {
  components: [],
  selectedId: null,
  history: [[]],
  historyIndex: 0,
  previewMode: false,
};

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case "ADD_COMPONENT": {
      const newComp = createComponent(action.payload.componentType);
      let newComponents: CanvasComponent[];
      if (action.payload.afterIndex !== undefined) {
        newComponents = [...state.components];
        newComponents.splice(action.payload.afterIndex + 1, 0, newComp);
      } else {
        newComponents = [...state.components, newComp];
      }
      return { ...pushHistory(state, newComponents), selectedId: newComp.id };
    }
    case "SELECT_COMPONENT":
      return { ...state, selectedId: action.payload };
    case "UPDATE_PROPS": {
      const newComponents = updateComponentById(
        state.components,
        action.payload.id,
        (c) => ({
          ...c,
          props: { ...c.props, ...action.payload.props },
        }),
      );
      return pushHistory(state, newComponents);
    }
    case "MOVE_COMPONENT": {
      const { fromIndex, toIndex } = action.payload;
      const newComponents = [...state.components];
      const [moved] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, moved);
      return pushHistory(state, newComponents);
    }
    case "DELETE_COMPONENT": {
      const newComponents = deleteById(state.components, action.payload);
      return { ...pushHistory(state, newComponents), selectedId: null };
    }
    case "UNDO": {
      if (state.historyIndex === 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        components: state.history[newIndex],
        historyIndex: newIndex,
        selectedId: null,
      };
    }
    case "REDO": {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        components: state.history[newIndex],
        historyIndex: newIndex,
      };
    }
    case "TOGGLE_PREVIEW":
      return { ...state, previewMode: !state.previewMode, selectedId: null };
    case "LOAD_STATE": {
      return {
        ...state,
        components: action.payload,
        history: [action.payload],
        historyIndex: 0,
      };
    }
    default:
      return state;
  }
}

export function useBuilder() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addComponent = useCallback(
    (componentType: ComponentType, afterIndex?: number) => {
      dispatch({
        type: "ADD_COMPONENT",
        payload: { componentType, afterIndex },
      });
    },
    [],
  );

  const selectComponent = useCallback((id: string | null) => {
    dispatch({ type: "SELECT_COMPONENT", payload: id });
  }, []);

  const updateProps = useCallback(
    (id: string, props: Partial<ComponentProps>) => {
      dispatch({ type: "UPDATE_PROPS", payload: { id, props } });
    },
    [],
  );

  const moveComponent = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: "MOVE_COMPONENT", payload: { fromIndex, toIndex } });
  }, []);

  const deleteComponent = useCallback((id: string) => {
    dispatch({ type: "DELETE_COMPONENT", payload: id });
  }, []);

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const togglePreview = useCallback(
    () => dispatch({ type: "TOGGLE_PREVIEW" }),
    [],
  );
  const loadState = useCallback((components: CanvasComponent[]) => {
    dispatch({ type: "LOAD_STATE", payload: components });
  }, []);

  const selectedComponent =
    state.components.find((c) => c.id === state.selectedId) ?? null;

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const exportHTML = useCallback(() => {
    function renderComponent(comp: CanvasComponent): string {
      const p = comp.props;
      const styleObj: Record<string, string> = {};
      if (p.color) styleObj.color = p.color;
      if (p.backgroundColor) styleObj.backgroundColor = p.backgroundColor;
      if (p.fontSize) styleObj.fontSize = `${p.fontSize}px`;
      if (p.fontWeight) styleObj.fontWeight = p.fontWeight;
      if (p.textAlign) styleObj.textAlign = p.textAlign;
      if (p.borderRadius) styleObj.borderRadius = `${p.borderRadius}px`;
      if (p.paddingTop !== undefined) styleObj.paddingTop = `${p.paddingTop}px`;
      if (p.paddingBottom !== undefined)
        styleObj.paddingBottom = `${p.paddingBottom}px`;
      if (p.paddingLeft !== undefined)
        styleObj.paddingLeft = `${p.paddingLeft}px`;
      if (p.paddingRight !== undefined)
        styleObj.paddingRight = `${p.paddingRight}px`;
      if (p.width) styleObj.width = p.width;
      if (p.height) styleObj.height = p.height;
      if (p.borderWidth && p.borderColor) {
        styleObj.border = `${p.borderWidth}px solid ${p.borderColor}`;
      }
      const style = Object.entries(styleObj)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`)
        .join(";");

      switch (comp.type) {
        case "heading":
          return `<h${p.level ?? 1} style="${style}">${p.text ?? ""}</h${p.level ?? 1}>`;
        case "text":
          return `<p style="${style}">${p.text ?? ""}</p>`;
        case "button":
          return `<button style="${style};cursor:pointer;display:inline-block">${p.text ?? ""}</button>`;
        case "link":
          return `<a href="${p.href ?? "#"}" style="${style}">${p.text ?? ""}</a>`;
        case "image":
          return `<img src="${p.src ?? ""}" alt="${p.alt ?? ""}" style="${style}" />`;
        case "section":
          return `<section style="${style}">${(comp.children ?? []).map(renderComponent).join("")}</section>`;
        case "container":
          return `<div style="${style};max-width:1100px;margin:0 auto">${(comp.children ?? []).map(renderComponent).join("")}</div>`;
        case "divider":
          return `<hr style="border:none;border-top:1px solid ${p.color ?? "#E5E7EB"};margin:${p.marginTop ?? 16}px 0 ${p.marginBottom ?? 16}px" />`;
        case "navbar":
          return `<nav style="${style};display:flex;align-items:center;justify-content:space-between"><span style="font-weight:700;font-size:18px">${p.text ?? "SiteName"}</span><div style="display:flex;gap:24px"><a href="#" style="color:${p.color ?? "#fff"};text-decoration:none">Home</a><a href="#" style="color:${p.color ?? "#fff"};text-decoration:none">Features</a><a href="#" style="color:${p.color ?? "#fff"};text-decoration:none">Pricing</a></div></nav>`;
        case "footer":
          return `<footer style="${style}"><p>${p.text ?? "© 2024 Your Company"}</p></footer>`;
        case "card":
          return `<div style="${style}">${p.text ?? ""}</div>`;
        case "form":
          return `<form style="${style}"><div style="margin-bottom:16px"><label style="display:block;margin-bottom:4px;font-weight:600">Name</label><input type="text" style="width:100%;padding:8px;border:1px solid #E5E7EB;border-radius:6px" /></div><div style="margin-bottom:16px"><label style="display:block;margin-bottom:4px;font-weight:600">Email</label><input type="email" style="width:100%;padding:8px;border:1px solid #E5E7EB;border-radius:6px" /></div><div style="margin-bottom:16px"><label style="display:block;margin-bottom:4px;font-weight:600">Message</label><textarea rows="4" style="width:100%;padding:8px;border:1px solid #E5E7EB;border-radius:6px"></textarea></div><button type="submit" style="background:#2563EB;color:#fff;padding:10px 20px;border:none;border-radius:8px;cursor:pointer">Send Message</button></form>`;
        case "columns": {
          const cols = p.columns ?? 2;
          const children = comp.children ?? [];
          while (children.length < cols)
            children.push({
              id: "",
              type: "text",
              props: { text: "Column content" },
            });
          return `<div style="${style};display:grid;grid-template-columns:repeat(${cols},1fr);gap:${p.gap ?? 24}px">${children.slice(0, cols).map(renderComponent).join("")}</div>`;
        }
        case "video":
          return `<div style="${style};position:relative;padding-bottom:56.25%;height:0"><iframe src="${p.src ?? ""}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none" allowfullscreen></iframe></div>`;
        default:
          return "";
      }
    }
    const body = state.components.map(renderComponent).join("\n");
    const html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n<title>My Page</title>\n<script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body style="margin:0;font-family:sans-serif">\n${body}\n</body>\n</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-page.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [state.components]);

  return {
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
  };
}
