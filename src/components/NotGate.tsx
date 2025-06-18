import { NotGateProps } from "@/types/types";
import { Group, Shape, Circle } from "react-konva";
import Konva from "konva";
import { useState, useRef, useEffect } from "react";

export default function Not(props: NotGateProps) {
    
    const [selected, setSelected] = useState<boolean>(props.selected)
    const groupRef = useRef<Konva.Group | null>(null)

    useEffect((): void => {
        requestAnimationFrame(() => {
            updatePortsOnDragEnd()
        })
    }, [])

    useEffect(() : void => {
        setSelected(props.selected)
    }, [props.selected])

    function updatePortsOnDragEnd(): void {
        if(!groupRef.current) {
            return
        }
        props.updateComponentPositionOnDrag(props.componentId, groupRef.current.getAbsolutePosition().x, groupRef.current.getAbsolutePosition().y)
    }

    function updatePortsOnDrag(): void {
        if(!groupRef.current) return

        props.updateConnectedWirePositionOnComponentDrag(props.componentId, groupRef.current.getAbsolutePosition().x, groupRef.current.getAbsolutePosition().y)
    }

    function onComponentClicked() : void {
        props.onSelectOrDeslectAComponent(props.componentId)
    }
  const width = 80;
  const height = 80;
  const pinLength = 10;
  const midY = height / 2;
  const bubbleRadius = 6;

  return (
    <Group 
        x={100} 
        y={100} 
        ref={groupRef}
        draggable
        onDragEnd={updatePortsOnDragEnd}
        onDragMove={updatePortsOnDrag}
        onClick={onComponentClicked}
    >
      {/* Triangle body with bubble */}
      <Shape
        width={width}
        height={height}
        sceneFunc={(context, shape) => {
          context.beginPath();

          // Triangle
          context.moveTo(0, 0);
          context.lineTo(0, height);
          context.lineTo(width - bubbleRadius * 2, midY);
          context.closePath();

          context.fillStrokeShape(shape);

          // Input pin
          context.beginPath();
          context.moveTo(-pinLength, midY);
          context.lineTo(0, midY);
          context.stroke();
          context.closePath();

          // Output pin (after bubble)
          context.beginPath();
          context.moveTo(width, midY);
          context.lineTo(width + pinLength + 8, midY);
          context.stroke();
          context.closePath();
        }}
        fill="#00D2FF"
        stroke={selected ? "blue" : "black"}
        shadowBlur={selected ? 5 : 0}
        strokeWidth={2}
      />

      {/* NOT bubble */}
      <Circle
        x={width - 6}
        y={midY}
        radius={bubbleRadius}
        stroke="black"
        strokeWidth={2}
      />

      {/* Input pin circle */}
      <Circle
        x={-pinLength}
        y={midY}
        radius={7}
        stroke="blue"
        strokeWidth={3}
      />

      {/* Output pin circle */}
      <Circle
        x={width + pinLength + 8}
        y={midY}
        radius={7}
        stroke="blue"
        strokeWidth={3}
      />
    </Group>
  );
}