import { OrGateProps } from "@/types/types";
import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Shape, Circle, Group } from "react-konva";

export default function OrGate(props: OrGateProps) {

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

    const width = 120
    const height = 100
    const midHeight = height/2
    const pinLength = 10
    const pinYOffset = 20

    return (
        <>
            <Group x={100} y={120} 
                draggable ref={groupRef} 
                onDragMove={() => updatePortsOnDrag()} 
                onDragEnd={() => updatePortsOnDragEnd()}
                onClick={() => onComponentClicked()}
            >

                <Shape
                    width={width}
                    height={height}
                    sceneFunc={(context, shape) => {
                        context.beginPath();

                        // Left back curve (concave)
                        context.moveTo(10, 0);
                        context.quadraticCurveTo(30, midHeight, 10, height);

                        // Bottom convex curve
                        context.quadraticCurveTo(width / 2, height, width, midHeight);

                        // Top convex curve
                        context.quadraticCurveTo(width / 2, 0, 10, 0);

                        context.closePath();
                        context.fillStrokeShape(shape);

                        // Top input pin
                        context.beginPath();
                        context.moveTo(-pinLength, pinYOffset);
                        context.lineTo(0, pinYOffset);
                        context.stroke();
                        context.closePath();

                        // Bottom input pin
                        context.beginPath();
                        context.moveTo(-pinLength, height - pinYOffset);
                        context.lineTo(0, height - pinYOffset);
                        context.stroke();
                        context.closePath();

                        // Output pin
                        context.beginPath();
                        context.moveTo(width, midHeight);
                        context.lineTo(width + pinLength, midHeight);
                        context.stroke();
                        context.closePath();
                    }}

                    fill="#00D2FF"
                    stroke={selected ? "blue" : "black"}
                    shadowBlur={selected ? 5 : 0}
                    strokeWidth={2}
                />
                <Circle
                    x={-pinLength}
                    y={pinYOffset}
                    radius={7}
                    stroke="blue"
                    strokeWidth={3}
                /> 
                <Circle
                    x={-pinLength}
                    y={height-pinYOffset}
                    radius={7}
                    stroke="blue"
                    strokeWidth={3}
                /> 
                <Circle
                    x={width+pinLength}
                    y={midHeight}
                    radius={7}
                    stroke="blue"
                    strokeWidth={3}
                />
            </Group>
        </>
    )
}