import { ComponentType } from "@/types/types";

interface Node {
    id: string,
    type: ComponentType,
    value: true | false | null,
    parents: string[],
    children: string[]
}

interface Edge {
    id: string
    from: string
    to: string
}

export default class LogicDag {
    private nodes: Map<string, Node> = new Map()
    private connections: Map<string, Edge> = new Map()
}