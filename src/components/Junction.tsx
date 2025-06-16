import { JunctionProps } from "@/types/types";
import Konva from "konva";
import { useRef, useEffect, useState } from "react";
import { Circle, Group, Line } from "react-konva";

export default function Junction(props: JunctionProps) {

  const [selected, setSelected] = useState<boolean>(props.selected)
  const groupRef = useRef<Konva.Group>(null)

  const radius = 7;
  const offset = 20; // Distance for connection pins


  useEffect((): void => {
      requestAnimationFrame(() => {
          updatePortsOnDragEnd()
      })
  }, [])

  useEffect((): void => {
    setSelected(props.selected)
  }, [props.selected])

  function updatePortsOnDragEnd(): void {
    if(!groupRef.current) return
        
    props.updateComponentPositionOnDrag(props.componentId, groupRef.current.getAbsolutePosition().x, groupRef.current.getAbsolutePosition().y)
  }

  function updatePortsOnDrag(): void {
    if(!groupRef.current) return
        
    props.updateConnectedWirePositionOnComponentDrag(props.componentId, groupRef.current.getAbsolutePosition().x, groupRef.current.getAbsolutePosition().y)
  }

  function onComponentClicked(): void {
    props.onSelectOrDeslectAComponent(props.componentId)
  }

  return (
    <Group x={400} y={400} 
      ref={groupRef} 
      draggable 
      onDragEnd={() => updatePortsOnDragEnd()} 
      onDragMove={() => updatePortsOnDrag()}
      onClick={() => onComponentClicked()}
    >
      {/* Central node */}
      <Circle 
        x={0} 
        y={0} 
        radius={radius} 
        fill={selected ? "blue" : "black"} 
        shadowBlur={selected ? 5 : 0}
      />

      {/* Connection lines */}
      <Line 
        points={[0, 0, 0, -offset]} 
        stroke={ selected ? "blue" : "black"}
        shadowBlur={selected ? 5 : 0} 
        strokeWidth={2} 
      />

      <Line 
        points={[0, 0, 0, offset]} 
        stroke={ selected ? "blue" : "black"}
        shadowBlur={selected ? 5 : 0} 
        strokeWidth={2} 
      />

      <Line 
        points={[0, 0, -offset, 0]} 
        stroke={ selected ? "blue" : "black"}
        shadowBlur={selected ? 5 : 0} 
        strokeWidth={2} 
      />

      <Line 
        points={[0, 0, offset, 0]} 
        stroke={ selected ? "blue" : "black"}
        shadowBlur={selected ? 5 : 0} 
        strokeWidth={2} 
      />

      {/* Connection pins */}
      <Circle x={0} y={-offset} radius={radius} stroke="blue" strokeWidth={2} />
      <Circle x={0} y={offset} radius={radius} stroke="blue" strokeWidth={2} />
      <Circle x={-offset} y={0} radius={radius} stroke="blue" strokeWidth={2} />
      <Circle x={offset} y={0} radius={radius} stroke="blue" strokeWidth={2} />
    </Group>
  );
}