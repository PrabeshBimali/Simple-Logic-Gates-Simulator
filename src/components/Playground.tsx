"use client"

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import OrGate from './OrGate';
import { ComponentType } from '@/types/types';
import { SimpleSwitch } from './SimpleSwitch';
import { Bulb } from './Bulb';
import Toolbar from '@/components/Toolbar';
import CircuitGraph, { IOComponent, Component, Port, WireType, WireEndPoint } from '@/logic/CircuitGraph';
import Wire from './Wire';
import Junction from './Junction';

export default function Playground() {

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [ visualComponents, setVisualComponents ] = useState<Component[] | IOComponent[]>([])
  const [ ports, setPorts ] = useState<Port[]>([])
  const [wires, setWires] = useState<WireType[]>([])
  const circuitGraphRef = useRef<CircuitGraph>(new CircuitGraph())

  function addNewComponent(x: number, y: number, type: ComponentType) : void {
    circuitGraphRef.current.addComponent(x, y, type);
    const components = circuitGraphRef.current.getComponents()
    const ports = circuitGraphRef.current.getPorts()
    const wires = circuitGraphRef.current.getWires()
    setVisualComponents([...components])
    setPorts([...ports])
    setWires([...wires])
  }

  function updateComponentPositionOnDrag(componentId: string, x: number, y: number) : void {
    circuitGraphRef.current.updateComponentPositionOnDragEnd(componentId, x, y);
    const components = circuitGraphRef.current.getComponents()
    const ports = circuitGraphRef.current.getPorts()
    setVisualComponents([...components])
    setPorts([...ports])
  }

  function onNewWireToComponentConnection(portId: string, wireEndPointId: string): void {
    circuitGraphRef.current.addNewWireToComponentConnection(portId, wireEndPointId);
    const components = circuitGraphRef.current.getComponents()
    const ports = circuitGraphRef.current.getPorts()
    setVisualComponents([...components])
    setPorts([...ports])
  }

  function onWireEndPointDragged(wireEndPointId: string, x: number, y: number) {
    circuitGraphRef.current.updateWireEndPointPositionOnDrag(wireEndPointId, x, y)
    const wires = circuitGraphRef.current.getWires()
    setWires([...wires])
  }

  function updateConnectedWirePositionOnComponentDrag(componentId: string, x: number, y: number) {
    circuitGraphRef.current.updateConnectedWireEndPointPositionOnComponentDrag(componentId, x, y)
    const wires = circuitGraphRef.current.getWires()
    setWires(wires)
  }

  const updateCanvas = () : void => {
      if (canvasContainerRef.current) {
        const { offsetWidth, offsetHeight } = canvasContainerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

  // TODO: FIX canvas size on resize
  useEffect(() => {
    updateCanvas();
    window.addEventListener("resize", updateCanvas);
    return () => window.removeEventListener("resize", updateCanvas);
  }, []);

  return (
    <>
      <div className='flex h-screen'>
        <div className='w-24 bg-gray-100'>
          <Toolbar addNewComponent={addNewComponent}/>
        </div>
        <div className='grow' ref={canvasContainerRef}>
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {
                visualComponents.map((component) => {
                  switch (component.type) {
                    case ComponentType.OR:
                      return <OrGate 
                                key={component.id} 
                                componentId={component.id} 
                                updateComponentPositionOnDrag={updateComponentPositionOnDrag}
                                updateConnectedWirePositionOnComponentDrag={updateConnectedWirePositionOnComponentDrag}              
                              />
                  
                    case ComponentType.INPUT:
                      return <SimpleSwitch 
                                key={component.id} 
                                componentId={component.id} 
                                updateComponentPositionOnDrag={updateComponentPositionOnDrag}
                                updateConnectedWirePositionOnComponentDrag={updateConnectedWirePositionOnComponentDrag}  
                              />

                    case ComponentType.OUTPUT:
                      return <Bulb 
                                key={component.id} 
                                componentId={component.id} 
                                updateComponentPositionOnDrag={updateComponentPositionOnDrag}
                                updateConnectedWirePositionOnComponentDrag={updateConnectedWirePositionOnComponentDrag}
                                />

                    case ComponentType.JUNCTION:
                      return <Junction 
                              key={component.id} 
                              componentId={component.id} 
                              updateComponentPositionOnDrag={updateComponentPositionOnDrag}
                              updateConnectedWirePositionOnComponentDrag={updateConnectedWirePositionOnComponentDrag}
                            />
                  
                    default:
                      break;
                  }
                })
              }

              {
                wires.map((wire: WireType) => {
                  return <Wire 
                          key={wire.id} 
                          ports={ports} 
                          wire={wire} 
                          onNewWireToComponentConnection={onNewWireToComponentConnection}
                          onWireEndPointDragged={onWireEndPointDragged}
                        />
                })
              }
            </Layer>
          </Stage>
        </div>
      </div>
    </>
  )
}