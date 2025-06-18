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
    WIRE = "WIRE",
    JUNCTION = "JUNCTION"
}

export type ToolbarProps = {
    addNewComponent: (x: number, y: number, type: ComponentType) => void
}

export type WireProps = {
    ports: Port[],
    wire: WireType,
    onNewWireToComponentConnection: (portId: string, wireId: string) => void,
    onWireEndPointDragged: (wireEndPointId: string, x: number, y: number) => void,
    onSelectOrDiselectWire: (wireId: string) => void
}

export type OrGateProps = {
    onSelectOrDeslectAComponent: (componentId: string) => void,
    updateComponentPositionOnDrag: (componentId: string, x: number, y:number) => void,
    updateConnectedWirePositionOnComponentDrag: (componentId: string, x: number, y: number) => void,
    componentId: string,
    selected: boolean
}

export type AndGateProps = {
    onSelectOrDeslectAComponent: (componentId: string) => void,
    updateComponentPositionOnDrag: (componentId: string, x: number, y:number) => void,
    updateConnectedWirePositionOnComponentDrag: (componentId: string, x: number, y: number) => void,
    componentId: string,
    selected: boolean
}

export type NotGateProps = {
    onSelectOrDeslectAComponent: (componentId: string) => void,
    updateComponentPositionOnDrag: (componentId: string, x: number, y:number) => void,
    updateConnectedWirePositionOnComponentDrag: (componentId: string, x: number, y: number) => void,
    componentId: string,
    selected: boolean
}

export type BulbProps = {
    onSelectOrDeslectAComponent: (componentId: string) => void,
    updateComponentPositionOnDrag: (componentId: string, x: number, y: number) => void,
    updateConnectedWirePositionOnComponentDrag: (componentId: string, x: number, y: number) => void,
    componentId: string,
    value: boolean | null,
    selected: boolean
}

export type SwitchProps = {
    onSelectOrDeslectAComponent: (componentId: string) => void,
    updateComponentPositionOnDrag: (componentId: string, x: number, y: number) => void,
    updateConnectedWirePositionOnComponentDrag: (componentId: string, x: number, y: number) => void,
    onSwitchClicked(id: string): void,
    value: boolean | null,
    componentId: string,
    selected: boolean
}

export type JunctionProps = {
    onSelectOrDeslectAComponent: (componentId: string) => void,
    updateComponentPositionOnDrag: (componentId: string, x: number, y: number) => void,
    updateConnectedWirePositionOnComponentDrag: (componentId: string, x: number, y: number) => void,
    componentId: string,
    selected: boolean
}