import Konva from "konva";
import { useRef, useState, useEffect } from "react";
import { BulbProps } from "@/types/types";
import { Group, Circle, Text, Line } from "react-konva";

export function Bulb(props: BulbProps) {


    const [isOn, setIsOn] = useState<boolean|null>(props.value)
    const [selected, setSelected] = useState<boolean>(props.selected)
    const groupRef = useRef<Konva.Group | null>(null)


    useEffect((): void => {
        requestAnimationFrame(() => {
            updatePortsOnDragEnd()
        })
    }, [])

    useEffect((): void => {
      setSelected(props.selected)
    }, [props.selected])

    useEffect((): void => {
      setIsOn(props.value)
    }, [props.value])

    function updatePortsOnDragEnd() : void {
      if(!groupRef.current) return
      props.updateComponentPositionOnDrag(props.componentId, groupRef.current.getAbsolutePosition().x, groupRef.current.getAbsolutePosition().y)
    }

    function updatePortsOnDrag() : void {
      if(!groupRef.current) return
      props.updateConnectedWirePositionOnComponentDrag(props.componentId, groupRef.current.getAbsolutePosition().x, groupRef.current.getAbsolutePosition().y)
    }

    function onComponentClicked() : void {
      props.onSelectOrDeslectAComponent(props.componentId)
    }

    return (
        <Group 
          x={300} 
          y={400} 
          ref={groupRef} 
          draggable 
          onDragEnd={() => updatePortsOnDragEnd()} 
          onDragMove={() => updatePortsOnDrag()}
          onClick={() => onComponentClicked()}
        >
            {/* Glow effect */}
            <Circle
              x={0}
              y={0}
              radius={15}
              fill="yellow"
              opacity={isOn === null ? 0 : (isOn ? 0.6: 0)}
              shadowBlur={20}
            />

            {/* Bulb */}
            <Circle
              x={0}
              y={0}
              radius={10}
              fill={isOn === null ? "#ccc" : (isOn ? "yellow" : "red")}
              stroke= {selected ? "blue" : "black" }
              shadowBlur={selected ? 5 : 0}
              strokeWidth={2}
            />

            {/* Label */}
            <Text
              text={`${isOn === null ? "X" : (isOn ? "ON" : "OFF")}`}
              x={-25}
              y={15}
              fontSize={10}
              fill="black"
              width={50}
              align="center"
            />

            {/* Port */ }
            <Line
                points={[-10, 0, -20, 0]}
                stroke= {selected ? "blue" : "black" }
                shadowBlur={selected ? 5 : 0}
                strokeWidth={3}
            />

            <Circle
                x={-20}
                y={0}
                radius={7}
                stroke="red"
                strokeWidth={3}
            />
    </Group>
    )
} 