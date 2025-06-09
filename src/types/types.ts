import { Port, WireEndPoint, WireType } from "@/logic/CircuitGraph"

export enum ComponentType {
    INPUT = "INPUT",
    OUTPUT = "OUTPUT",
    AND = "AND",
    OR = "OR",
    NOT = "NOT",
    NAND = "NAND",
    NOR = "NOR",
    XOR = "XOR",
    XNOR = "XNOR",
    WIRE = "WIRE"
}

export type ToolbarProps = {
    addNewComponent: (x: number, y: number, type: ComponentType) => void
}

export type WireProps = {
    ports: Port[],
    wire: WireType,
    wireEndPoints: WireEndPoint[],
    onNewWireToComponentConnection: (portId: string, wireId: string) => void,
    onNewWireToWireConnection: (wireEndPoint1: string, wireEndPoint2: string) => void,
    onWireEndPointDragged: (wireEndPointId: string, x: number, y: number) => void
}

export type OrGateProps = {
    updateComponentPositionOnDrag: (componentId: string, x: number, y:number) => void,
    componentId: string
}

export type BulbProps = {
    updateComponentPositionOnDrag: (componentId: string, x: number, y: number) => void,
    componentId: string
}

export type SwitchProps = {
    updateComponentPositionOnDrag: (componentId: string, x: number, y: number) => void,
    componentId: string
}