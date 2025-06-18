"use client"

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import OrGate from './OrGate';
import { ComponentType } from '@/types/types';
import { SimpleSwitch } from './SimpleSwitch';
import { Bulb } from './Bulb';
import Toolbar from '@/components/Toolbar';
import CircuitGraph, { Component, Port, WireType } from '@/logic/CircuitGraph';
import Wire from './Wire';
import Junction from './Junction';
import And from './AndGate';
import Not from './NotGate';

export default function Playground() {

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [ visualComponents, setVisualComponents ] = useState<Component[]>([])
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

  function onSwitchClicked(componentId: string): void {
    circuitGraphRef.current.updateValueOnSwitchClicked(componentId)
    const components = circuitGraphRef.current.getComponents()
    setVisualComponents([...components])
  }

  function onSelectOrDeselectAComponent(componentId: string) : void {
    circuitGraphRef.current.selectOrDeselectAComponent(componentId)
    const components = circuitGraphRef.current.getComponents()
    setVisualComponents([...components])
  }

  function onSelectOrDeselectAWire(wireId: string): void {
    circuitGraphRef.current.selectOrDiselectAWire(wireId)
    const newWires: WireType[] = circuitGraphRef.current.getWires()
    setWires([...newWires])
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Backspace') {
            circuitGraphRef.current.deleteSelectedComponents()
            circuitGraphRef.current.deleteSelectedWires()
            const newComponents: Component[] = circuitGraphRef.current.getComponents()
            const newWires: WireType[] = circuitGraphRef.current.getWires()
            setVisualComponents(newComponents)
            setWires(newWires)
            e.preventDefault();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
                                selected={component.selected}
                                updateComponentPositionOnDrag={updateComponentPositionOnDrag}
                                updateConnectedWirePositionOnComponentDrag={updateConnectedWirePositionOnComponentDrag}              
                                onSelectOrDeslectAComponent={onSelectOrDeselectAComponent}
                              />

                    case ComponentType.AND:
                      return <And 
                                key={component.id} 
                                componentId={component.id} 
                                selected={component.selected}
                                updateComponentPositionOnDrag={updateComponentPositionOnDrag}
                                updateConnectedWirePositionOnComponentDrag={updateConnectedWirePositionOnComponentDrag}              
                                onSelectOrDeslectAComponent={onSelectOrDeselectAComponent}
                              />
                    
                    case ComponentType.NOT:
                      return <Not 
                                key={component.id} 
                                componentId={component.id} 
                                selected={component.selected}
                                updateComponentPositionOnDrag={updateComponentPositionOnDrag}
                                updateConnectedWirePositionOnComponentDrag={updateConnectedWirePositionOnComponentDrag}              
                                onSelectOrDeslectAComponent={onSelectOrDeselectAComponent}
                              />
                  
                    case ComponentType.INPUT:
                      return <SimpleSwitch 
                                key={component.id} 
                                componentId={component.id} 
                                value={component.value}
                                selected={component.selected}
                                updateComponentPositionOnDrag={updateComponentPositionOnDrag}
                                updateConnectedWirePositionOnComponentDrag={updateConnectedWirePositionOnComponentDrag}  
                                onSwitchClicked={onSwitchClicked}
                                onSelectOrDeslectAComponent={onSelectOrDeselectAComponent}
                              />

                    case ComponentType.OUTPUT:
                      return <Bulb 
                                key={component.id} 
                                componentId={component.id} 
                                value={component.value}
                                selected={component.selected}
                                updateComponentPositionOnDrag={updateComponentPositionOnDrag}
                                updateConnectedWirePositionOnComponentDrag={updateConnectedWirePositionOnComponentDrag}
                                onSelectOrDeslectAComponent={onSelectOrDeselectAComponent}
                              />

                    case ComponentType.JUNCTION:
                      return <Junction 
                                key={component.id} 
                                componentId={component.id} 
                                selected={component.selected}
                                updateComponentPositionOnDrag={updateComponentPositionOnDrag}
                                updateConnectedWirePositionOnComponentDrag={updateConnectedWirePositionOnComponentDrag}
                                onSelectOrDeslectAComponent={onSelectOrDeselectAComponent}
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
                          onSelectOrDiselectWire={onSelectOrDeselectAWire}
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