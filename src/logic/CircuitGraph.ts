import { ComponentType } from "@/types/types"
import { InputDimensions, ORGateDimensions, OutputDimensions, startPositionAndDimension } from "./componentTemplates";

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

export interface WireCompenent extends Component {
    connectedFrom: string, // portid
    connectedTo: string
}

export interface Port {
    id: string,
    parentId: string, // id of parent component
    connected: boolean,
    x: number,
    y: number,
    direction: "INPUT" | "OUTPUT", 
}


export default class CircuitGraph {
    private components: Map<string, Component | IOComponent | WireCompenent> = new Map();
    private ports: Map<string, Port> = new Map();
    private numberOFIdsForEachComponent: Map<ComponentType, number> = new Map();

    // variables for initial dimensions
    private orGateDimensions: ORGateDimensions;
    private inputDimensions: InputDimensions;
    private outputDimensions: OutputDimensions;


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

        this.orGateDimensions = startPositionAndDimension(ComponentType.OR)
        this.inputDimensions = startPositionAndDimension(ComponentType.INPUT)
        this.outputDimensions = startPositionAndDimension(ComponentType.OUTPUT)

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
            console.log("ABS: Positions: ", component.x, " ", component.y)
            const inputPort1: Port = {
               id: `${component.id}$A`,
               parentId: component.id,
               connected: false,
               x: component.x + this.orGateDimensions.inputAx,
               y: component.y + this.orGateDimensions.inputAy,
               direction: "INPUT"  
            }

            const inputPort2: Port = {
                id: `${component.id}$B`,
                parentId: component.id,
                connected: false,
                x: component.x + this.orGateDimensions.inputBx,
                y: component.y + this.orGateDimensions.inputBy,
                direction: "INPUT"
            }

            const outputPort: Port = {
                id: `${component.id}$C`,
                parentId: component.id,
                connected: false,
                x: component.x + this.orGateDimensions.outputx,
                y: component.y + this.orGateDimensions.outputy,
                direction: "OUTPUT"
            }

            this.ports.set(inputPort1.id, inputPort1);
            this.ports.set(inputPort2.id, inputPort2);
            this.ports.set(outputPort.id, outputPort);
            this.components.get(component.id)?.ports.push(inputPort1.id, inputPort2.id, outputPort.id)

        } else if(component.type === ComponentType.INPUT) {
            const port: Port = {
                id: `${component.id}$A`,
                parentId: component.id,
                connected: false,
                x: component.x + this.inputDimensions.outputx,
                y: component.y + this.inputDimensions.outputy,
                direction: "OUTPUT"
            };

            this.ports.set(port.id, port);
            this.components.get(component.id)?.ports.push(port.id)

        } else if(component.type === ComponentType.OUTPUT) {
            const port: Port = {
                id: `${component.id}$A`,
                parentId: component.id,
                connected: false,
                x: component.x + this.outputDimensions.inputx,
                y: component.y + this.outputDimensions.inputy,
                direction: "INPUT"
            };

            this.ports.set(port.id, port);
            this.components.get(component.id)?.ports.push(port.id)

        }
    }
    
    addComponent(x: number, y: number, componentType: ComponentType) : void {
        const newId: string = this.generateNewId(componentType);
        let newComponent: Component | IOComponent | WireCompenent;

        if(componentType === ComponentType.WIRE) {

            newComponent = {
                id: newId,
                type: componentType,
                x: x,
                y: y,
                selected: false,
                connectedFrom: "",
                connectedTo: "",
                ports: []
            }
    
            this.components.set(newId, newComponent)

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

        }
        
    }

    updatePositionOnDrag(id: string, x: number, y: number) : void {
        const component: Component | IOComponent | WireCompenent |undefined = this.components.get(id)

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
}