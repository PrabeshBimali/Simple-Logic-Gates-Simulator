import { SwitchProps } from "@/types/types";
import Konva from "konva";
import { useRef, useState, useEffect } from "react";
import { Circle, Group, Label, Line, Rect, Tag, Text } from "react-konva";

export function SimpleSwitch(props: SwitchProps) {

    const [isOn, setIsOn] = useState<boolean | null>(props.value)
    const groupRef = useRef<Konva.Group | null>(null)
    const [selected, setSelected] = useState<boolean>(props.selected)

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

    useEffect(() : void => {
        setIsOn(props.value)
        setSelected(props.selected)
    }, [props.value, props.selected])
    
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

    function onSwitchClicked(e: Konva.KonvaEventObject<MouseEvent>): void {
        props.onSwitchClicked(props.componentId)
        e.cancelBubble = true
        //updte isOn using use Effect
    }

    function onComponentClicked(): void {
        props.onSelectOrDeslectAComponent(props.componentId)
    }

    const width = 30
    const height = 30
    const pinLength = 15
    return (
        <Group x={100} y={120} 
            ref={groupRef}
            draggable 
            onDragEnd={() => updatePositionOnDragEnd()}
            onDragMove={()=> updatePortsOnDrag()}
            onClick={() => onComponentClicked()}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <Rect
                width={width}
                height={height}
                fill="white"
                stroke={selected ? "blue" : "black"}
                strokeWidth={3}
                shadowBlur={selected ? 5: 0}
            />
            <Circle
                x={width/2}
                y={height/2}
                radius={9}
                stroke="black"
                fill={`${isOn ? "#1ff21f" : "red"}`}
                strokeWidth={2}
                onClick={onSwitchClicked}
            />
            <Line 
                points={[width, height/2, width+pinLength, height/2]}
                strokeWidth={2}
                stroke={ selected ? "blue" : "black"}
                shadowBlur={selected ? 5: 0}
            />
            <Label x={0} y={height+2} opacity={0.75}>
                <Tag fill="white" />
                <Text
                    width={width}
                    text={`${isOn ? "ON" : "OFF"}`}
                    fontFamily="Calibri"
                    fontSize={10}
                    padding={4}
                    align="center"
                    fill="black"
                />
            </Label> 
            <Circle
                x={width+pinLength}
                y={height/2}
                radius={7}
                stroke={selected ? "blue" : "black"}
                shadowBlur={selected ? 5 : 0}
                strokeWidth={3} 
            />
        </Group>
    )
}