import Konva from "konva";
import { useRef, useState, useEffect } from "react";
import { BulbProps, DockPoint } from "@/types/types";
import { Group, Circle, Text, Line } from "react-konva";

export function Bulb(props: BulbProps) {


    const [isOn, setIsOn] = useState<boolean>(true)
    const groupRef = useRef<Konva.Group | null>(null)


    useEffect((): void => {
        requestAnimationFrame(() => {
            updateDockPoints()
        })
    }, [])

    function updateDockPoints() : void {
      if(!groupRef.current) return
      props.updateComponentPositionOnDrag(props.componentId, groupRef.current?.getAbsolutePosition().x, groupRef.current?.getAbsolutePosition().y)
    }

    return (
        <Group x={300} y={400} ref={groupRef} draggable onDragEnd={() => updateDockPoints()}>
            {/* Glow effect */}
            <Circle
              x={0}
              y={0}
              radius={15}
              fill="yellow"
              opacity={isOn ? 0.6 : 0}
              shadowBlur={20}
            />

            {/* Bulb */}
            <Circle
              x={0}
              y={0}
              radius={10}
              fill={isOn ? "yellow" : "#ccc"}
              stroke="black"
              strokeWidth={2}
            />

            {/* Label */}
            <Text
              text={`${isOn ? "ON" : "OFF"}`}
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
                stroke="black"
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