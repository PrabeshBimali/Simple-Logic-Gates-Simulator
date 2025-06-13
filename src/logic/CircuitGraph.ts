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
    connectedWiresEndPoints: string[] //wireId
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
               connectedWiresEndPoints: []
            }

            const inputPort2: Port = {
                id: `${component.id}$B`,
                parentId: component.id,
                connected: false,
                x: component.x + this.orGateDimensions.inputBx,
                y: component.y + this.orGateDimensions.inputBy,
                direction: "INPUT",
                connectedWiresEndPoints: []
            }

            const outputPort: Port = {
                id: `${component.id}$C`,
                parentId: component.id,
                connected: false,
                x: component.x + this.orGateDimensions.outputx,
                y: component.y + this.orGateDimensions.outputy,
                direction: "OUTPUT",
                connectedWiresEndPoints: []
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
                connectedWiresEndPoints: []
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
                connectedWiresEndPoints: []
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
                connectedWiresEndPoints: []
            }
            
            const portB: Port = {
                id: `${component.id}$B`,
                parentId: component.id,
                connected: false,
                x: component.x + this.junctionDimensions.portBx,
                y: component.x  + this.junctionDimensions.portBy,
                direction: "BOTH", //Both because port direction  will change based on input,
                connectedWiresEndPoints: []
            }
            
            const portC: Port = {
                id: `${component.id}$C`,
                parentId: component.id,
                connected: false,
                x: component.x + this.junctionDimensions.portCx,
                y: component.x  + this.junctionDimensions.portCy,
                direction: "BOTH", //Both because port direction  will change based on input,
                connectedWiresEndPoints: []
            }
            
            const portD: Port = {
                id: `${component.id}$D`,
                parentId: component.id,
                connected: false,
                x: component.x + this.junctionDimensions.portDx,
                y: component.x  + this.junctionDimensions.portDy,
                direction: "BOTH", //Both because port direction  will change based on input,
                connectedWiresEndPoints: []
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
        
        // return when multiple wires are trying to connect in same port. User will use junction to share outpur values
        if(port.connected) return

        const component: Component | undefined = this.components.get(port.parentId)

        if (!component) {
            throw new Error(`Component with id: ${port.parentId} not found`)
        }

        // Since Junction direction depends on Connection we define it here
        if (component.type === ComponentType.JUNCTION) {
            // For new Junction port without defined INPUT OUTPUT direction cannot a wire not connected to any other ports
            if(!wire.connectedFrom && !wire.connectedTo && port.direction === "BOTH") return

            // do not allow another input
            if(wire.connectedFrom && port.direction !== "BOTH") return

            // Junction cannot send output without input first
            if(wire.connectedTo && port.direction === "BOTH") return

            if(wire.connectedFrom) {
                port.direction = "INPUT"

                for (const otherPortId of component.ports) {
                    // do not update direction for current port
                    if(otherPortId === port.id) continue

                    const otherPort: Port | undefined = this.ports.get(otherPortId)

                    if(!otherPort) {
                        throw new Error(`Other Junction Port with ID: ${otherPortId} does not exist`)
                    }

                    otherPort.direction = "OUTPUT"
                }
            }

            if(wire.connectedTo) {
                port.direction = "OUTPUT"
            }
        }

        port.connectedWiresEndPoints.push(wireEndPoint.id)
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

    updateWireEndPointPositionOnDrag(wireEndPointId: string, x: number, y: number) : void {
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

    updateEachPortPositionOnDragEnd(portId: string, componentType: ComponentType, x: number, y: number) {
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

        } else if (componentType === ComponentType.JUNCTION) {

            const id: string = portId.split("$")[1]

            if (id === "A") {

                port.x = x + this.junctionDimensions.portAx
                port.y = y + this.junctionDimensions.portAy

            } else if (id === "B") {

                port.x = x + this.junctionDimensions.portBx
                port.y = y + this.junctionDimensions.portBy

            } else if (id === "C") {

                port.x = x + this.junctionDimensions.portCx
                port.y = y + this.junctionDimensions.portCy

            } else if (id === "D") {

                port.x = x + this.junctionDimensions.portDx
                port.y = y + this.junctionDimensions.portDy

            }
        }
    }

    updateComponentPositionOnDragEnd(id: string, x: number, y: number) : void {
        const component: Component | IOComponent |undefined = this.components.get(id)

        if(!component) {
            throw new Error(`Component does not exist for component id: ${id}`)
        }

        component.x = x;
        component.y = y;

        for(let i = 0; i < component.ports.length; i++) {
            this.updateEachPortPositionOnDragEnd(component.ports[i], component.type, x, y)
        }

        console.log(this.ports)
    }

    updateConnectedWireEndPointPositionOnComponentDrag(componentId: string, x: number, y: number) {
        // get abs position for component
        // calculate abs positions for its ports
        // update wire endpoint position which are connected to those ports

        const component: Component | undefined = this.components.get(componentId)

        if(!component) {
            throw new Error(`Component with id: ${componentId} not found`)
        }
        
        for (const portId of component.ports) {
            const port: Port | undefined = this.ports.get(portId)

            if(!port) {
                throw new Error(`Port on Component, ${componentId}, with ID: ${portId} not found`)
            }

            if(!port.connected) continue 

            if(component.type === ComponentType.OR) {

                this.updateConnectedWireEndPointPositionOnOrGateDrag(port, x, y)

            } else if(component.type === ComponentType.INPUT) {

                this.updateConnectedWireEndPointPositionOnInputDrag(port, x, y)

            } else if(component.type === ComponentType.OUTPUT) {

                this.updateConnectedWireEndPointPositionOnOutputDrag(port, x, y)

            } else if(component.type === ComponentType.JUNCTION) {
                this.updateConnectedWireEndPointPositionOnJunctionDrag(port, x, y)
            }
        }

    }

    updateConnectedWireEndPointsToPortPositionsOnDrag(port: Port): void {
        for(const wireEndPointId of port.connectedWiresEndPoints) {
            const wireEndPoint: WireEndPoint | undefined = this.wireEndPoints.get(wireEndPointId)

            if (!wireEndPoint) {
                throw Error(`WireEndpoint with ID: ${wireEndPointId} not found`)
            }

            const wire: WireType | undefined = this.wires.get(wireEndPoint.parentId)

            if(!wire) {
                throw Error(`Wire with ID: ${wireEndPoint.parentId} not found`)
            }

            wireEndPoint.x = port.x
            wireEndPoint.y = port.y

            if(wireEndPointId === wire.startPoint.id) {
                wire.startPoint.x = port.x
                wire.startPoint.y = port.y
            } else {
                wire.endPoint.x = port.x
                wire.endPoint.y = port.y
            }

            const newWireEndPoint: WireEndPoint = {...wireEndPoint}
            const newWire: WireType = {...wire}

            this.wires.set(wire.id, newWire)
            this.wireEndPoints.set(wireEndPointId, newWireEndPoint)
        }
    }

    updateConnectedWireEndPointPositionOnOrGateDrag(port: Port, componentX: number, componentY: number) {
        const portId: string = port.id

        const uniquePort: string = portId.split("$")[1]

        if(uniquePort === "A") {
            port.x = componentX + this.orGateDimensions.inputAx
            port.y = componentY + this.orGateDimensions.inputAy
        } else if (uniquePort === "B") {
            port.x = componentX + this.orGateDimensions.inputBx
            port.y = componentY + this.orGateDimensions.inputBy
        } else if(uniquePort === "C") {
            port.x = componentX + this.orGateDimensions.outputx
            port.y = componentY + this.orGateDimensions.outputy
        }

        this.updateConnectedWireEndPointsToPortPositionsOnDrag(port)
    }

    updateConnectedWireEndPointPositionOnInputDrag(port: Port, componentX: number, componentY: number) {
        port.x = componentX + this.inputDimensions.outputx
        port.y = componentY + this.inputDimensions.outputy
        
        this.updateConnectedWireEndPointsToPortPositionsOnDrag(port)
    }

    updateConnectedWireEndPointPositionOnOutputDrag(port: Port, componentX: number, componentY: number) {
        port.x = componentX + this.outputDimensions.inputx
        port.y = componentY + this.outputDimensions.inputy

        this.updateConnectedWireEndPointsToPortPositionsOnDrag(port)
    }

    updateConnectedWireEndPointPositionOnJunctionDrag(port: Port, componentx: number, componentY: number) {
        const portId: string = port.id
        const uniquePort: string = portId.split("$")[1]

        if(uniquePort === "A") {

            port.x = componentx + this.junctionDimensions.portAx
            port.y = componentY + this.junctionDimensions.portAy

        } else if(uniquePort === "B") {

            port.x = componentx + this.junctionDimensions.portBx
            port.y = componentY + this.junctionDimensions.portBy

        } else if(uniquePort === "C") {

            port.x = componentx + this.junctionDimensions.portCx
            port.y = componentY + this.junctionDimensions.portCy

        } else if(uniquePort === "D") {

            port.x = componentx + this.junctionDimensions.portDx
            port.y = componentY + this.junctionDimensions.portDy

        }

        this.updateConnectedWireEndPointsToPortPositionsOnDrag(port)

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