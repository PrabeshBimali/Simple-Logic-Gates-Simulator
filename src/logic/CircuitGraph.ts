import { ComponentType } from "@/types/types"
import { InputDimensions, ORGateDimensions, OutputDimensions, startPositionAndDimension, WireDimensions, JunctionDimensions } from "./componentTemplates";

export interface Component {
    id: string,
    type: ComponentType,
    x: number,
    y: number,
    selected: boolean,
    ports: string[]
}

export interface IOComponent extends Component {
    value: boolean
}

export interface WireType {
    id: string,
    type: ComponentType,
    selected: boolean,
    connectedFrom: string,
    connectedTo: string,
    startPoint: WireEndPoint,
    endPoint: WireEndPoint
}

export interface WireEndPoint {
    id: string,
    x: number,
    y: number,
    parentId: string, //wire id
    connectedToPort: boolean
}

export interface Port {
    id: string,
    parentId: string, // id of parent component
    connected: boolean,
    x: number,
    y: number,
    direction: "INPUT" | "OUTPUT" | "BOTH", 
    connectedWiresPorts: string[] //wireId
}


export default class CircuitGraph {
    private components: Map<string, Component | IOComponent > = new Map();
    private ports: Map<string, Port> = new Map();
    private wires: Map<string, WireType> = new Map();
    private wireEndPoints: Map<string, WireEndPoint> = new Map();
    private numberOFIdsForEachComponent: Map<ComponentType, number> = new Map();

    // variables for initial dimensions
    private orGateDimensions: ORGateDimensions;
    private inputDimensions: InputDimensions;
    private outputDimensions: OutputDimensions;
    private wireDimensions: WireDimensions;
    private junctionDimensions: JunctionDimensions;


    constructor() {
        this.numberOFIdsForEachComponent.set(ComponentType.AND, 0)
        this.numberOFIdsForEachComponent.set(ComponentType.OR, 0)
        this.numberOFIdsForEachComponent.set(ComponentType.NOT, 0)
        this.numberOFIdsForEachComponent.set(ComponentType.INPUT, 0)
        this.numberOFIdsForEachComponent.set(ComponentType.OUTPUT, 0)
        this.numberOFIdsForEachComponent.set(ComponentType.NOR, 0)
        this.numberOFIdsForEachComponent.set(ComponentType.XNOR, 0)
        this.numberOFIdsForEachComponent.set(ComponentType.NAND, 0)
        this.numberOFIdsForEachComponent.set(ComponentType.XOR, 0)
        this.numberOFIdsForEachComponent.set(ComponentType.WIRE, 0)
        this.numberOFIdsForEachComponent.set(ComponentType.JUNCTION, 0)

        this.orGateDimensions = startPositionAndDimension(ComponentType.OR)
        this.inputDimensions = startPositionAndDimension(ComponentType.INPUT)
        this.outputDimensions = startPositionAndDimension(ComponentType.OUTPUT)
        this.wireDimensions = startPositionAndDimension(ComponentType.WIRE)
        this.junctionDimensions = startPositionAndDimension(ComponentType.JUNCTION)

    }

    private generateNewId(component: ComponentType) : string {
       
        const count : number | undefined = this.numberOFIdsForEachComponent.get(component)
        if(count === undefined) {
            return ""
        } 
        const newId: string = component + `_${count+1}`
        return newId
    }

    addPort(component: Component | IOComponent) : void {
        if(component.type === ComponentType.OR) {
            const inputPort1: Port = {
               id: `${component.id}$A`,
               parentId: component.id,
               connected: false,
               x: component.x + this.orGateDimensions.inputAx,
               y: component.y + this.orGateDimensions.inputAy,
               direction: "INPUT",
               connectedWiresPorts: []
            }

            const inputPort2: Port = {
                id: `${component.id}$B`,
                parentId: component.id,
                connected: false,
                x: component.x + this.orGateDimensions.inputBx,
                y: component.y + this.orGateDimensions.inputBy,
                direction: "INPUT",
                connectedWiresPorts: []
            }

            const outputPort: Port = {
                id: `${component.id}$C`,
                parentId: component.id,
                connected: false,
                x: component.x + this.orGateDimensions.outputx,
                y: component.y + this.orGateDimensions.outputy,
                direction: "OUTPUT",
                connectedWiresPorts: []
            }

            this.ports.set(inputPort1.id, inputPort1);
            this.ports.set(inputPort2.id, inputPort2);
            this.ports.set(outputPort.id, outputPort);
            component.ports.push(inputPort1.id, inputPort2.id, outputPort.id)

        } else if(component.type === ComponentType.INPUT) {
            const port: Port = {
                id: `${component.id}$A`,
                parentId: component.id,
                connected: false,
                x: component.x + this.inputDimensions.outputx,
                y: component.y + this.inputDimensions.outputy,
                direction: "OUTPUT",
                connectedWiresPorts: []
            };

            this.ports.set(port.id, port);
            component.ports.push(port.id)

        } else if(component.type === ComponentType.OUTPUT) {
            const port: Port = {
                id: `${component.id}$A`,
                parentId: component.id,
                connected: false,
                x: component.x + this.outputDimensions.inputx,
                y: component.y + this.outputDimensions.inputy,
                direction: "INPUT",
                connectedWiresPorts: []
            };

            this.ports.set(port.id, port);
            component.ports.push(port.id)

        } else if(component.type === ComponentType.JUNCTION) {
            const portA: Port = {
                id: `${component.id}$A`,
                parentId: component.id,
                connected: false,
                x: component.x + this.junctionDimensions.portAx,
                y: component.x  + this.junctionDimensions.portAy,
                direction: "BOTH", //Both because port direction  will change based on input,
                connectedWiresPorts: []
            }
            
            const portB: Port = {
                id: `${component.id}$B`,
                parentId: component.id,
                connected: false,
                x: component.x + this.junctionDimensions.portBx,
                y: component.x  + this.junctionDimensions.portBy,
                direction: "BOTH", //Both because port direction  will change based on input,
                connectedWiresPorts: []
            }
            
            const portC: Port = {
                id: `${component.id}$C`,
                parentId: component.id,
                connected: false,
                x: component.x + this.junctionDimensions.portCx,
                y: component.x  + this.junctionDimensions.portCy,
                direction: "BOTH", //Both because port direction  will change based on input,
                connectedWiresPorts: []
            }
            
            const portD: Port = {
                id: `${component.id}$D`,
                parentId: component.id,
                connected: false,
                x: component.x + this.junctionDimensions.portDx,
                y: component.x  + this.junctionDimensions.portDy,
                direction: "BOTH", //Both because port direction  will change based on input,
                connectedWiresPorts: []
            }

            this.ports.set(portA.id, portA)
            this.ports.set(portB.id, portB)
            this.ports.set(portC.id, portC)
            this.ports.set(portD.id, portD)
            component.ports.push(portA.id, portB.id, portC.id, portD.id)
        } 
    }

    newWireEndPoints(wireId: string): WireEndPoint[] {
        const endPoint1: WireEndPoint = {
            id: `${wireId}$A`,
            x: this.wireDimensions.x1,
            y: this.wireDimensions.y1,
            parentId: wireId,
            connectedToPort: false
        } 

        const endPoint2: WireEndPoint = {
            id: `${wireId}$B`,
            x: this.wireDimensions.x2,
            y: this.wireDimensions.y2,
            parentId: wireId,
            connectedToPort: false
        }

        this.wireEndPoints.set(endPoint1.id, endPoint1)
        this.wireEndPoints.set(endPoint2.id, endPoint2)

        return [endPoint1, endPoint2]
    }
    
    addComponent(x: number, y: number, componentType: ComponentType) : void {
        const newId: string = this.generateNewId(componentType);
        let newComponent: Component | IOComponent;

        if(componentType === ComponentType.WIRE) {
            const endPoints: WireEndPoint[] = this.newWireEndPoints(newId)
            const newWire: WireType = {
                id: newId,
                type: componentType,
                selected: false,
                connectedFrom: "",
                connectedTo: "",
                startPoint: endPoints[0],
                endPoint: endPoints[1]
            }
            this.wires.set(newId, newWire)

        } else if(componentType === ComponentType.INPUT || componentType === ComponentType.OUTPUT) {
            newComponent = {
                id: newId,
                type: componentType,
                x: x,
                y: y,
                selected: false,
                value: false,
                ports: []
            }

            this.components.set(newId, newComponent)
            this.addPort(newComponent)

        } else{
            newComponent = {
                id: newId,
                type: componentType,
                x: x,
                y: y,
                selected: false,
                ports: []
            }

            this.components.set(newId, newComponent)
            this.addPort(newComponent)
        }


        const count: number = this.numberOFIdsForEachComponent.get(componentType) || 0;
        this.numberOFIdsForEachComponent.set(componentType, count + 1)
    }

    addNewWireToComponentConnection(portId: string, wireEndPointId: string) : void {
        const port: Port | undefined = this.ports.get(portId);
        const wireEndPoint: WireEndPoint | undefined = this.wireEndPoints.get(wireEndPointId);

        if(!port || !wireEndPoint) {
            throw new Error(`${portId} or ${wireEndPointId} port does not exsit`)
        }

        const parentWireId: string = wireEndPoint.parentId
        // again i have to put wirecomponents in different variable
        const wire: WireType | undefined = this.wires.get(parentWireId)

        if(!wire) {
            throw new Error(`Wire with id: ${parentWireId} not found`)
        }
        
        // return when multiple wires are trying to connect in same input port
        if(port.connected && port.direction === "INPUT") return

        port.connectedWiresPorts.push(wireEndPoint.id)
        port.connected = true

        if (port.direction === "INPUT") {
            wire.connectedTo = port.id
        } else {
            wire.connectedFrom = port.id
        }

        if(wireEndPointId === wire.startPoint.id) {
            wire.startPoint.x = port.x
            wire.startPoint.y = port.y
        } else {
            wire.endPoint.x = port.x
            wire.endPoint.y = port.y
        }

        wireEndPoint.x = port.x 
        wireEndPoint.y = port.y 
        wireEndPoint.connectedToPort = true
        
        const newWireEndPoint: WireEndPoint = {...wireEndPoint}
        const newWire: WireType = { ...wire }
        this.wires.set(parentWireId, newWire)
        this.wireEndPoints.set(wireEndPointId, newWireEndPoint)
    }


    addNewWireToWireConnection(draggedEndPointId: string, targetEndPointId: string): void {
        const draggedEndPoint: WireEndPoint | undefined = this.wireEndPoints.get(draggedEndPointId)
        const targetEndPoint: WireEndPoint | undefined = this.wireEndPoints.get(targetEndPointId)

        if (!draggedEndPoint || !targetEndPoint) {
            throw new Error(`Wire Endpoints: ${draggedEndPointId} or ${targetEndPointId} does not exist`)
        }

        const draggedWire: WireType | undefined = this.wires.get(draggedEndPoint.parentId)
        const targetWire: WireType | undefined = this.wires.get(targetEndPoint.parentId)

        if (!draggedWire || !targetWire) {
            throw new Error(`Wires: ${draggedEndPoint.parentId} or ${targetEndPoint.parentId} does not exist`)
        }

        // return if wire is connecting to itself
        if(draggedWire.id === targetWire.id) return

        // return if targer endpoint is already connected to a port
        if(targetEndPoint.connectedToPort) return

        // if both wire is getting signal from some port they cannot connect
        if(draggedWire.connectedFrom && targetWire.connectedFrom) return

        // if one of wire is receiving signal from some port connected wire should receive same signal
        if(draggedWire.connectedFrom) {
            targetWire.connectedFrom = draggedWire.connectedFrom
        } else {
            draggedWire.connectedFrom = targetWire.connectedFrom
        }

        if(draggedEndPoint.id === draggedWire.startPoint.id) {
            draggedWire.startPoint.x = targetEndPoint.x
            draggedWire.startPoint.y = targetEndPoint.y
        } else {
            draggedWire.endPoint.x = targetEndPoint.x
            draggedWire.endPoint.y = targetEndPoint.y
        }

        draggedEndPoint.x = targetEndPoint.x
        draggedEndPoint.y = targetEndPoint.y

        const newDraggedEndPoint: WireEndPoint = {...draggedEndPoint}
        const newDraggedWire: WireType = {...draggedWire}
        const newTargetWire: WireType = {...targetWire}
        this.wires.set(draggedWire.id, newDraggedWire)
        this.wires.set(targetWire.id, newTargetWire)
        this.wireEndPoints.set(draggedEndPointId, newDraggedEndPoint)
    }

    updateWirePositionOnDrag(wireEndPointId: string, x: number, y: number) : void {
        const endPoint: WireEndPoint | undefined = this.wireEndPoints.get(wireEndPointId)
        
        if(!endPoint) {
            throw new Error(`Wire Endpoint with id: ${wireEndPointId} not found`)
        }

        const wire: WireType | undefined = this.wires.get(endPoint.parentId)

        if(!wire) {
            throw new Error(`Wire with id: ${endPoint.parentId} not found`)
        }

        if(wire.startPoint.id === wireEndPointId) {
            wire.startPoint.x = x
            wire.startPoint.y = y
        } else {
            wire.endPoint.x = x
            wire.endPoint.y = y
        }

        endPoint.x = x
        endPoint.y = y

        const newEndPoint: WireEndPoint = {...endPoint}
        const newWire: WireType = {...wire}
        this.wires.set(wire.id, newWire)
        this.wireEndPoints.set(endPoint.id, newEndPoint)
    }

    updateConnectedWirePosition(wirePortId: string, x: number, y: number): void {
        const endPoint: string = wirePortId.split("$")[1]
        const wirePort: WireEndPoint | undefined = this.wireEndPoints.get(wirePortId)

        if(!wirePort) {
            throw new Error(`Wire port: ${wirePortId} not Found`)
        }
        
        const wire: WireType | undefined = this.wires.get(wirePort.parentId)

        if(!wire) {
            throw new Error(`Wire with id: ${wirePort.parentId} not found`)
        }

        wirePort.x = x
        wirePort.y = y

        const newWire: WireType = {...wire}
        this.wires.set(wirePort.parentId, newWire)
    }

    updatePortPositionOnDrag(portId: string, componentType: ComponentType, x: number, y: number) {
        const port: Port | undefined = this.ports.get(portId); 

        if(!port) {
            throw new Error(`Port does not exist for Port id: ${portId}`)
        }

        //update port position
        if (componentType === ComponentType.OR) {
            const id: string = portId.split("$")[1]

            if (id === "A") {
                port.x = x + this.orGateDimensions.inputAx
                port.y = y + this.orGateDimensions.inputAy
            }

            if (id === "B") {
                port.x = x + this.orGateDimensions.inputBx
                port.y = y + this.orGateDimensions.inputBy
            }

            if (id === "C") {
                port.x = x + this.orGateDimensions.outputx
                port.y = y + this.orGateDimensions.outputy
            }


        } else if (componentType === ComponentType.INPUT) {

            port.x = x + this.inputDimensions.outputx
            port.y = y + this.inputDimensions.outputy

        } else if (componentType === ComponentType.OUTPUT) {

            port.x = x + this.outputDimensions.inputx;
            port.y = y + this.outputDimensions.inputy;

        } else if (componentType === ComponentType.WIRE) {
            
            const id: string = portId.split("$")[1]

            if(id === "A") {

                port.x = x + this.wireDimensions.x1
                port.y = y + this.wireDimensions.y1
            } else {

                port.x = x + this.wireDimensions.x2
                port.y = y + this.wireDimensions.y2
            }
        }
        
        for(const wireId of port.connectedWiresPorts) {
            this.updateConnectedWirePosition(wireId, port.x, port.y)
        }

    }

    updatePositionOnDrag(id: string, x: number, y: number) : void {
        const component: Component | IOComponent |undefined = this.components.get(id)

        if(!component) {
            throw new Error(`Component does not exist for component id: ${id}`)
        }

        component.x = x;
        component.y = y;

        for(let i = 0; i < component.ports.length; i++) {
            this.updatePortPositionOnDrag(component.ports[i], component.type, x, y)
        }
    }
    
    getComponents() : Component[] | IOComponent[] {
        return Array.from(this.components.values()) 
    }

    getPorts() : Port[] {
        return Array.from(this.ports.values())
    }

    getWires() : WireType[] {
        return Array.from(this.wires.values())
    }

    getWireEndPoints(): WireEndPoint[] {
        return Array.from(this.wireEndPoints.values())
    }
}