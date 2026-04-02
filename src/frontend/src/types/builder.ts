export type ComponentType =
  | "heading"
  | "text"
  | "image"
  | "button"
  | "link"
  | "section"
  | "container"
  | "columns"
  | "divider"
  | "video"
  | "navbar"
  | "footer"
  | "card"
  | "form";

export interface ComponentProps {
  text?: string;
  src?: string;
  alt?: string;
  href?: string;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontWeight?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  borderRadius?: number;
  width?: string;
  height?: string;
  textAlign?: "left" | "center" | "right";
  display?: string;
  flexDirection?: string;
  gap?: number;
  columns?: number;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  children?: CanvasComponent[];
}

export interface BuilderState {
  components: CanvasComponent[];
  selectedId: string | null;
  history: CanvasComponent[][];
  historyIndex: number;
  previewMode: boolean;
}
