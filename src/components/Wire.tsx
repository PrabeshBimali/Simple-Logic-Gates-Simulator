import { WireProps } from "@/types/types"
import Konva from "konva"
import { useEffect, useRef, useState } from "react"
import { Circle, Group, Line } from "react-konva"

export default function Wire(props: WireProps) {

    const [ lineStartPoints, setLineStartPoints ] = useState<number[]>([50, 120])
    const [ lineEndPoints, setLineEndPoints ] = useState<number[]>([210, 120])
    const startCircleRef = useRef<Konva.Circle | null>(null)
    const endCircleRef = useRef<Konva.Circle | null>(null)

    function startPointDragged(e: Konva.KonvaEventObject<DragEvent>): void {
        setLineStartPoints([e.target.getAbsolutePosition().x, e.target.getAbsolutePosition().y])
    }

    function endPointDragged(e: Konva.KonvaEventObject<DragEvent>): void {
        setLineEndPoints([e.target.getAbsolutePosition().x, e.target.getAbsolutePosition().y])
    }

    useEffect(() : void => {
        requestAnimationFrame(() => {

        })
    }, [])

    function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
        const distance: number = Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2))
        return distance
    }

    function dock(e: Konva.KonvaEventObject<DragEvent>): void {
        const circleX: number = e.target.getAbsolutePosition().x;
        const circleY: number = e.target.getAbsolutePosition().y;

        for (let i = 0; i < props.ports.length; i++) {
            const targetX: number = props.ports[i].x;
            const targetY: number = props.ports[i].y;
                
            const distance: number = calculateDistance(circleX, circleY, targetX, targetY);
            
            if(distance <= 7) {
                if(e.target.attrs.anchor === "line_end") {
                    setLineEndPoints([targetX, targetY])
                } else {
                    setLineStartPoints([targetX, targetY])
                }
            }
        }
    }

    function handleDragEnd(e: Konva.KonvaEventObject<DragEvent>): void {
        dock(e)
    }

    return (
        <>
            <Group>
                <Line
                  points={[...lineStartPoints, ...lineEndPoints]}
                  stroke="blace"
                  strokeWidth={3}
                  lineCap="round"
                  lineJoin="round"
                />
                <Circle
                    x={lineStartPoints[0]}
                    y={lineStartPoints[1]}
                    radius={7}
                    stroke="blue"
                    strokeWidth={3}
                    draggable
                    anchor="line_start"
                    onDragMove={startPointDragged}
                    ref={startCircleRef}
                    onDragEnd={handleDragEnd}
                /> 
                <Circle
                    x={lineEndPoints[0]}
                    y={lineEndPoints[1]}
                    radius={7}
                    stroke="blue"
                    strokeWidth={3}
                    draggable
                    anchor="line_end"
                    onDragMove={endPointDragged}
                    ref={endCircleRef}
                    onDragEnd={handleDragEnd}
                /> 
            </Group>
        </>
    )
}