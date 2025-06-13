import { WireProps } from "@/types/types"
import Konva from "konva"
import { useEffect, useRef, useState } from "react"
import { Circle, Group, Line } from "react-konva"

export default function Wire(props: WireProps) {


    const { wire } = props
    const [ lineStartPoints, setLineStartPoints ] = useState<number[]>([wire.startPoint.x, wire.startPoint.y])
    const [ lineEndPoints, setLineEndPoints ] = useState<number[]>([wire.endPoint.x, wire.endPoint.y])
    const startCircleRef = useRef<Konva.Circle | null>(null)
    const endCircleRef = useRef<Konva.Circle | null>(null)
    const [ lineColor, setLineColor ] = useState<string>("black")

    function startPointDragged(e: Konva.KonvaEventObject<DragEvent>): void {
        const x: number = e.target.getAbsolutePosition().x
        const y: number = e.target.getAbsolutePosition().y
        setLineStartPoints([x, y])
        props.onWireEndPointDragged(props.wire.startPoint.id, x, y)
    }

    function endPointDragged(e: Konva.KonvaEventObject<DragEvent>): void {
        const x: number = e.target.getAbsolutePosition().x
        const y: number = e.target.getAbsolutePosition().y
        setLineEndPoints([x, y])
        props.onWireEndPointDragged(props.wire.endPoint.id, x, y)
    }

    useEffect(() : void => {
        requestAnimationFrame(() => {
            setLineStartPoints([wire.startPoint.x, wire.startPoint.y]);
            setLineEndPoints([wire.endPoint.x, wire.endPoint.y]);
        })
    }, [wire])

    function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
        const distance: number = Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2))
        return distance
    }

    function dock(e: Konva.KonvaEventObject<DragEvent>): void {
        const threshold = 7
        const circleX: number = e.target.getAbsolutePosition().x;
        const circleY: number = e.target.getAbsolutePosition().y;
        const {ports} = props

        for (let i = 0; i < ports.length; i++) {
            const targetX: number = ports[i].x;
            const targetY: number = ports[i].y;

            const distance: number = calculateDistance(circleX, circleY, targetX, targetY);
            
            if(distance <= threshold) {
                if(e.target.attrs.anchor === "A") {
                    props.onNewWireToComponentConnection(ports[i].id, props.wire.startPoint.id)
                    setLineStartPoints([props.wire.startPoint.x, props.wire.startPoint.y])
                } else {
                    props.onNewWireToComponentConnection(ports[i].id, props.wire.endPoint.id)
                    setLineEndPoints([props.wire.endPoint.x, props.wire.endPoint.y])
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
                  stroke={lineColor}
                  strokeWidth={3}
                  lineCap="round"
                  lineJoin="round"
                  hitStrokeWidth={20}
                />
                <Circle
                    x={lineStartPoints[0]}
                    y={lineStartPoints[1]}
                    radius={7}
                    stroke="blue"
                    strokeWidth={3}
                    draggable
                    anchor="A"
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
                    anchor="B"
                    onDragMove={endPointDragged}
                    ref={endCircleRef}
                    onDragEnd={handleDragEnd}
                /> 
            </Group>
        </>
    )
}