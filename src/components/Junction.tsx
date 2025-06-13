import { JunctionProps } from "@/types/types";
import Konva from "konva";
import { useRef, useEffect } from "react";
import { Circle, Group, Line } from "react-konva";

export default function Junction(props: JunctionProps) {

  const groupRef = useRef<Konva.Group>(null)

  const radius = 7;
  const offset = 15; // Distance for connection pins


  useEffect((): void => {
      requestAnimationFrame(() => {
          updatePortsOnDragEnd()
      })
  }, [])

  function updatePortsOnDragEnd(): void {
    if(!groupRef.current) return
        
    props.updateComponentPositionOnDrag(props.componentId, groupRef.current.getAbsolutePosition().x, groupRef.current.getAbsolutePosition().y)
  }

  function updatePortsOnDrag(): void {
    if(!groupRef.current) return
        
    props.updateConnectedWirePositionOnComponentDrag(props.componentId, groupRef.current.getAbsolutePosition().x, groupRef.current.getAbsolutePosition().y)
  }

  return (
    <Group x={400} y={400} ref={groupRef} draggable onDragEnd={() => updatePortsOnDragEnd()} onDragMove={() => updatePortsOnDrag()}>
      {/* Central node */}
      <Circle x={0} y={0} radius={radius} fill="black" />

      {/* Connection lines */}
      <Line points={[0, 0, 0, -offset]} stroke="black" strokeWidth={2} />
      <Line points={[0, 0, 0, offset]} stroke="black" strokeWidth={2} />
      <Line points={[0, 0, -offset, 0]} stroke="black" strokeWidth={2} />
      <Line points={[0, 0, offset, 0]} stroke="black" strokeWidth={2} />

      {/* Connection pins */}
      <Circle x={0} y={-offset} radius={radius} stroke="blue" strokeWidth={2} />
      <Circle x={0} y={offset} radius={radius} stroke="blue" strokeWidth={2} />
      <Circle x={-offset} y={0} radius={radius} stroke="blue" strokeWidth={2} />
      <Circle x={offset} y={0} radius={radius} stroke="blue" strokeWidth={2} />
    </Group>
  );
}