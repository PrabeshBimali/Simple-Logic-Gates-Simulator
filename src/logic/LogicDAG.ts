import { ComponentType } from "@/types/types";

interface Node {
    id: string,
    type: ComponentType,
    value: true | false | null,
    parents: Array<string>,
    children: Array<string>
}

export default class LogicDag {
    private nodes: Map<string, Node> = new Map()
    private nodeDependenciesMap: Map<string, number> = new Map()

    addNode(id: string, type: ComponentType): void {

        if(this.nodes.has(id)) {
            throw new Error(`${id} Node already Exists`)
        }

        const newNode: Node = {
            id: id,
            type: type,
            value: null,
            parents: new Array<string>(),
            children: new Array<string>()
        }

        if(type === ComponentType.INPUT) {
            newNode.value = false
        }
        this.nodes.set(id, newNode)
        this.nodeDependenciesMap.set(id, 0)
    }

    addNewEdge(fromId: string, toId: string): void {
        if(toId === fromId) {
            throw new Error(`Cannot connect same Nodes`)
        }

        const toNode: Node | undefined = this.nodes.get(toId)
        const fromNode: Node | undefined = this.nodes.get(fromId)

        if(!toNode || !fromNode) {
            throw new Error(`Nodes ${toId} or ${fromId} does not exist`)
        }

        // connection already exists
        // removing this line because same component can get both inputs from same parent component
        //if(fromNode.children.has(toId)) return

        if(this.willCycleForm(fromId, toId)) {
            throw new Error(`Cycle will form from this connection`)
        }

        fromNode.children.push(toId)
        toNode.parents.push(fromId)

        const toNodeDependencies: number | undefined = this.nodeDependenciesMap.get(toId)

        if (toNodeDependencies === undefined) {
            throw new Error(`AddNewEdge DAG: Componenet Id ${toId} doesn't exist in dependencies map`)
        } 
       
        console.log(`TOID: ${toId}, FromId: ${fromId}`)
        this.nodeDependenciesMap.set(toId, toNodeDependencies + 1)
    } 

    private willCycleForm(fromId: string, toId: string): boolean {
        const visited: Set<string> = new Set()
        const stack: string[] = new Array()

        stack.push(toId)

        while(stack.length > 0) {
            const currentId: string | undefined = stack.pop()

            if (!currentId) {
                throw new Error(`willCycleForm: stack is empty`)
            }

            // continue to next node if current is already visited
            if(visited.has(currentId)) continue

            // that means it contains a cycle
            if(currentId === fromId) return true

            visited.add(toId)
            const currentNode: Node | undefined = this.nodes.get(currentId)

            if(!currentNode) {
                throw new Error(`Node with Id: ${currentId} not found`)
            }

            for (const nodeId of currentNode.children) {
                stack.push(nodeId)
            }
        }

        return false
    }

    private findTopologicalOrderingForTheGraph() : string[] {
        const orderedGraph: string[] = new Array<string>()
        const dependencies: Map<string, number> = new Map(this.nodeDependenciesMap)

        const queue: string[] = new Array<string>()

        for (const key of dependencies.keys()) {
            if(dependencies.get(key) === 0) {
                queue.push(key)
            }
        }

        while(queue.length > 0) {
            const currentId = queue.shift()

            if(!currentId) {
                throw new Error(`Topological Sort: queue is empty`)
            }

            orderedGraph.push(currentId)

            const currentNode: Node | undefined = this.nodes.get(currentId)

            if(!currentNode) {
                throw new Error(`Topological Sort: Node with Id: ${currentId} does not exist`)
            }

            for (const key of currentNode.children) {
                const childDependecies : number | undefined = dependencies.get(key)

                if(childDependecies === undefined) {
                    throw new Error(`Topological Sort: Dependencies for Id: ${key} does not exist`)
                }
                const newNumberOfDependencies: number = childDependecies - 1
                dependencies.set(key, newNumberOfDependencies)

                if(newNumberOfDependencies === 0) {
                    queue.push(key)
                }
            }
        }

        if(orderedGraph.length !== this.nodes.size) {
            console.log("Orddered GRAPH: ", orderedGraph)
            throw new Error(`Topological Sort: All Nodes are not ordered`)
        }

        return orderedGraph
    }

    evaluateGraph(): void {
        const orderedGraph: string[] = this.findTopologicalOrderingForTheGraph()

        for (const nodeId of orderedGraph) {
            const node: Node | undefined = this.nodes.get(nodeId)

            if(!node) {
                throw new Error(`Evaluate Graph: Node with Id: ${nodeId} does not exist`)
            }

            if(node.type === ComponentType.OR) {
                this.evaluateOr(node)
            } else if(node.type === ComponentType.AND) {
                this.evaluateAnd(node)
            } else if(node.type === ComponentType.NOT) {
                this.evaluateNot(node)
            } else if(node.type === ComponentType.JUNCTION || node.type === ComponentType.OUTPUT) {
                this.evaluateRest(node)
            }
        }

        console.log("NODES: ", this.nodes)
    }

    getNodeValueById(id: string): boolean|null {
        const node: Node | undefined = this.nodes.get(id);

        if (!node) {
            throw new Error(`DAG -> getNodeById: Node with ID: ${id} does not exist`)
        }

        return node.value
    }

    setValueById(id: string, value: boolean|null) {
        const node: Node | undefined = this.nodes.get(id);

        if (!node) {
            throw new Error(`DAG -> getNodeById: Node with ID: ${id} does not exist`)
        }

        node.value = value
        return node.value
    }

    deleteAnEdge(fromId: string, toId: string) {
        const fromNode: Node | undefined = this.nodes.get(fromId)
        const toNode: Node | undefined = this.nodes.get(toId)

        if (!fromNode || !toNode) {
            throw new Error(`Node with ID: ${fromId} or ${toId} does not exist`)
        }

        // delete children from "from node"
        const newChildren: string[] = fromNode.children.filter(val => val !== toId)
        fromNode.children = newChildren

        // delete parent from "to node"
        const newParents: string[] = toNode.parents.filter(val => val !== fromId)
        toNode.parents = newParents

        // decrease number of dependencies in to node
        const toNodeDependencies: number | undefined = this.nodeDependenciesMap.get(toId)

        if (toNodeDependencies === undefined) {
            throw new Error(`Componenet Id ${toId} doesn't exist in dependencies map`)
        } 
       
        this.nodeDependenciesMap.set(toId, toNodeDependencies - 1)

    }

    deleteNodeById(id: string) {
        const node: Node | undefined = this.nodes.get(id)
        
        if(!node) {
            throw new Error(`Node with id: ${id} does not exist`)
        }

        for (const childId of node.children) {
            this.deleteAnEdge(id, childId)
        }

        for (const parentId of node.parents) {
            this.deleteAnEdge(parentId, id)
        }

        // delete node and remove it from dependencies map
        this.nodes.delete(id)
        this.nodeDependenciesMap.delete(id)

    }

    private evaluateOr(node: Node) {
        if (node.parents.length < 2) {
            node.value = null
            return
        }

        const inputNode1: Node | undefined = this.nodes.get(node.parents[0]);
        const inputNode2: Node | undefined = this.nodes.get(node.parents[1]);

        if(!inputNode1 || !inputNode2) {
            throw new Error(`Evaluate OR: Node with ID ${node.parents[0]} or Node with ID ${node.parents[1]} does not exist`)
        }

        if (inputNode1.value === null || inputNode2.value === null) {
            node.value = null
            return
        }

        node.value = inputNode1.value || inputNode2.value
    }

    private evaluateAnd(node: Node) {
        if (node.parents.length < 2) {
            node.value = null
            return
        }

        const inputNode1: Node | undefined = this.nodes.get(node.parents[0]);
        const inputNode2: Node | undefined = this.nodes.get(node.parents[1]);

        if(!inputNode1 || !inputNode2) {
            throw new Error(`Evaluate AND: Node with ID ${node.parents[0]} or Node with ID ${node.parents[1]} does not exist`)
        }

        if (inputNode1.value === null || inputNode2.value === null) {
            node.value = null
            return
        }

        node.value = inputNode1.value && inputNode2.value
    }

    private evaluateNot(node: Node) {
        if (node.parents.length < 1) {
            node.value = null
            return
        }

        const inputNode: Node | undefined = this.nodes.get(node.parents[0]);

        if(!inputNode) {
            throw new Error(`Evaluate REST: Node with ID ${node.parents[0]} does not exist`)
        }

        if (inputNode.value === null) {
            node.value = null
            return
        }

        node.value = !inputNode.value

    }

    private evaluateRest(node: Node) {
        if (node.parents.length < 1) {
            node.value = null
            return
        }

        const inputNode: Node | undefined = this.nodes.get(node.parents[0]);

        if(!inputNode) {
            throw new Error(`Evaluate REST: Node with ID ${node.parents[0]} does not exist`)
        }

        if (inputNode.value === null) {
            node.value = null
            return
        }

        node.value = inputNode.value

    }
}