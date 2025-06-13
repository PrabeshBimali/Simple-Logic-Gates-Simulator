import { SwitchProps } from "@/types/types";
import Konva from "konva";
import { useRef, useState, useEffect } from "react";
import { Circle, Group, Label, Line, Rect, Tag, Text } from "react-konva";

export function SimpleSwitch(props: SwitchProps) {

    const [isOn, setIsOn] = useState<boolean>(false)
    const groupRef = useRef<Konva.Group | null>(null)

    function handleMouseOver(e: Konva.KonvaEventObject<MouseEvent>): void {
        const stage: Konva.Stage | null = e.target.getStage()
        if(stage) {
            stage.container().style.cursor = "pointer"
        }
    }

    useEffect((): void => {
        requestAnimationFrame(() => {
            updatePositionOnDragEnd()
        })
    }, [])
    
    function updatePositionOnDragEnd() : void {
        if(!groupRef.current) return
        
        props.updateComponentPositionOnDrag(props.componentId, groupRef.current.getAbsolutePosition().x, groupRef.current.getAbsolutePosition().y)
    }

    
    function updatePortsOnDrag(): void {
        if(!groupRef.current) return

        props.updateConnectedWirePositionOnComponentDrag(props.componentId, groupRef.current.getAbsolutePosition().x, groupRef.current.getAbsolutePosition().y)
    }

    function handleMouseOut(e: Konva.KonvaEventObject<MouseEvent>): void {
        const stage: Konva.Stage | null = e.target.getStage()
        if(stage) {
            stage.container().style.cursor = "default"
        }
    }

    const width = 20
    const height = 20
    const pinLength = 10
    return (
        <Group x={100} y={120} 
            ref={groupRef}
            draggable 
            onClick={() => {setIsOn(!isOn)}}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onDragEnd={() => updatePositionOnDragEnd()}
            onDragMove={()=> updatePortsOnDrag()}
        >
            <Rect
                width={width}
                height={height}
                fill="white"
                stroke="black"
                strokeWidth={3}
            />
            <Circle
                x={width/2}
                y={height/2}
                radius={7}
                stroke="black"
                fill={`${isOn ? "green" : "red"}`}
                strokeWidth={2}
            />
            <Line 
                points={[width, height/2, width+pinLength, height/2]}
                strokeWidth={2}
                stroke="black"
            />
            <Label x={0} y={height+2} opacity={0.75}>
                <Tag fill="white" />
                <Text
                    text={`${isOn ? "ON" : "OFF"}`}
                    fontFamily="Calibri"
                    fontSize={10}
                    padding={3}
                    fill="black"
                />
            </Label> 
            <Circle
                x={width+pinLength}
                y={height/2}
                radius={7}
                stroke="black"
                strokeWidth={3} 
            />
        </Group>
    )
}