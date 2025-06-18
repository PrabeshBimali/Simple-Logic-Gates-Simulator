// components/Toolbar.tsx
import { ComponentType, ToolbarProps } from "@/types/types"

const componentTypes: { type: ComponentType; label: string }[] = [
  { type: ComponentType.OR, label: "OR" },
  { type: ComponentType.AND, label: "AND" },
  { type: ComponentType.NOT, label: "NOT" },
  { type: ComponentType.INPUT, label: "Input" },
  { type: ComponentType.OUTPUT, label: "Output" },
  { type: ComponentType.WIRE, label: "Wire" },
  { type: ComponentType.JUNCTION, label: "Junction" }
];

export default function Toolbar(props : ToolbarProps) {

    const initialPosition = {
        x: 400,
        y: 400
    }

  return (
    <div className="fixed top-0 left-0 h-full w-24 bg-gray-800 text-white flex flex-col items-center py-4 space-y-4 shadow-md z-50">
      {componentTypes.map((comp) => (
        <button
            onClick={() => props.addNewComponent(initialPosition.x, initialPosition.y, comp.type)}
            key={comp.type}
            className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-sm text-center"
        >
          {comp.label}
        </button>
      ))}
    </div>
  );
}