import { AndGateProps } from "@/types/types";
import { Group, Shape, Circle } from "react-konva";
import Konva from "konva";
import { useRef, useEffect, useState } from "react";

export default function And(props: AndGateProps) {

    
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

  const width = 100;
  const height = 100;
  const radius = height / 2;
  const pinLength = 10;
  const pinYOffset = 20;
  const midY = height / 2;

  return (
    <Group 
        x={100} 
        y={100} 
        draggable
        ref={groupRef}
        onDragEnd={updatePortsOnDragEnd}
        onDragMove={updatePortsOnDrag}
        onClick={onComponentClicked}
    >
      <Shape
        width={width}
        height={height}
        sceneFunc={(context, shape) => {
          const w = shape.width();
          const h = shape.height();
          const r = h / 2;

          context.beginPath();

          // Left vertical line
          context.moveTo(0, 0);
          context.lineTo(0, h);

          // Bottom line to arc start
          context.lineTo(w - r, h);

          // Right arc
          context.arc(w - r, h / 2, r, Math.PI / 2, -Math.PI / 2, true);

          // Top line
          context.lineTo(0, 0);

          context.closePath();
          context.fillStrokeShape(shape);

          // Input pin A
          context.beginPath();
          context.moveTo(-pinLength, pinYOffset);
          context.lineTo(0, pinYOffset);
          context.stroke();
          context.closePath()

          // Input pin B
          context.beginPath();
          context.moveTo(-pinLength, h - pinYOffset);
          context.lineTo(0, h - pinYOffset);
          context.stroke();
          context.closePath()

          // Output pin
          context.beginPath();
          context.moveTo(w, midY);
          context.lineTo(w + pinLength, midY);
          context.stroke();
          context.closePath()
        }}
        fill="#00D2FF"
        stroke={selected ? "blue" : "black"}
        shadowBlur={selected ? 5 : 0}
        strokeWidth={2}
      />

      {/* Input A */}
      <Circle
        x={-pinLength}
        y={pinYOffset}
        radius={7}
        stroke="blue"
        strokeWidth={3}
      />
      {/* Input B */}
      <Circle
        x={-pinLength}
        y={height - pinYOffset}
        radius={7}
        stroke="blue"
        strokeWidth={3}
      />
      {/* Output */}
      <Circle
        x={width + pinLength}
        y={midY}
        radius={7}
        stroke="blue"
        strokeWidth={3}
      />
    </Group>
  );
}