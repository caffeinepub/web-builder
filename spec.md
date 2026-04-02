# Web Builder

## Current State
New project with empty Motoko backend stub and no frontend.

## Requested Changes (Diff)

### Add
- Full drag-and-drop website builder UI in React/TypeScript/Tailwind
- Left sidebar: palette of draggable component blocks (Heading, Text, Image, Button, Section, Columns, Divider, Video)
- Main canvas: droppable area where components are placed, selected, reordered, resized
- Right sidebar: property editor panel (text content, color, font size, padding, background, border radius, etc.) for selected component
- Top toolbar: app name, undo/redo buttons, preview mode toggle, export HTML button
- Inline editing: double-click text/heading/button to edit content inline
- Live property reflection: any change in right panel immediately reflects on canvas
- Preview mode: hides all editing chrome and shows final rendered page
- Export HTML: generates full standalone HTML file and triggers browser download
- Undo/redo: full history stack for all canvas mutations

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Define TypeScript types: `ComponentType`, `CanvasComponent`, `BuilderState`
2. Implement state management with `useReducer` for undo/redo history
3. Build `LeftSidebar` with component palette items using HTML5 drag API
4. Build `Canvas` with dragover/drop handlers, component rendering, selection
5. Build `RightSidebar` with property form fields wired to dispatch
6. Build `Toolbar` with undo/redo/preview/export actions
7. Implement inline editing on double-click
8. Implement HTML export function
9. Wire everything together in `App.tsx`
10. Validate and fix lint/type/build errors
