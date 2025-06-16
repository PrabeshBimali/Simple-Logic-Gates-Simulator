import { WireProps } from "@/types/types"
import Konva from "konva"
import { useEffect, useRef, useState } from "react"
import { Circle, Group, Line } from "react-konva"

export default function Wire(props: WireProps) {


    const { wire } = props
    const [selected, setSelected] = useState(props.wire.selected)
    const [startPointConnected, setStartPointConnected] = useState(props.wire.startPoint.connectedToPort)
    const [endPointConnected, setEndPointConnected] = useState(props.wire.endPoint.connectedToPort)
    const [ lineStartPoints, setLineStartPoints ] = useState<number[]>([wire.startPoint.x, wire.startPoint.y])
    const [ lineEndPoints, setLineEndPoints ] = useState<number[]>([wire.endPoint.x, wire.endPoint.y])
    const startCircleRef = useRef<Konva.Circle | null>(null)
    const endCircleRef = useRef<Konva.Circle | null>(null)

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

    useEffect((): void => {
        setSelected(props.wire.selected)
    }, [props.wire.selected])

    useEffect((): void => {
        setStartPointConnected(props.wire.startPoint.connectedToPort)
        setEndPointConnected(props.wire.endPoint.connectedToPort)
    }, [props.wire, props.wire])

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

    function handleMouseOver(e: Konva.KonvaEventObject<MouseEvent>): void {
        const stage: Konva.Stage | null = e.target.getStage()
        if(stage) {
            stage.container().style.cursor = "pointer"
        }
    }

    function handleMouseOut(e: Konva.KonvaEventObject<MouseEvent>): void {
        const stage: Konva.Stage | null = e.target.getStage()
        if(stage) {
            stage.container().style.cursor = "default"
        }
    }

    function selectOrDiselect() {
        props.onSelectOrDiselectWire(props.wire.id)
    }

    return (
        <>
            <Group>
                <Line
                  points={[...lineStartPoints, ...lineEndPoints]}
                  stroke={selected ? "blue" : "black"}
                  shadowBlur={selected ? 3 : 0}
                  strokeWidth={3}
                  lineCap="round"
                  lineJoin="round"
                  hitStrokeWidth={20}
                  onMouseDown={selectOrDiselect}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                />
                <Circle
                    x={lineStartPoints[0]}
                    y={lineStartPoints[1]}
                    radius={7}
                    stroke="blue"
                    strokeWidth={3}
                    draggable={!startPointConnected}
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
                    draggable={!endPointConnected}
                    anchor="B"
                    onDragMove={endPointDragged}
                    ref={endCircleRef}
                    onDragEnd={handleDragEnd}
                /> 
            </Group>
        </>
    )
}