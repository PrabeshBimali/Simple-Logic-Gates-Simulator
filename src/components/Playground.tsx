"use client"

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import OrGate from './OrGate';
import Wire from './Wire';
import { ComponentType } from '@/types/types';
import { SimpleSwitch } from './SimpleSwitch';
import { Bulb } from './Bulb';
import Toolbar from '@/components/Toolbar';
import CircuitGraph, { IOComponent, Component, WireCompenent, Port } from '@/logic/CircuitGraph';

export default function Playground() {

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [ visualComponents, setVisualComponents ] = useState<Component[] | IOComponent[] | WireCompenent[]>([])
  const [ ports, setPorts ] = useState<Port[]>([])
  const circuitGraphRef = useRef<CircuitGraph>(new CircuitGraph())

  function addNewComponent(x: number, y: number, type: ComponentType) : void {
    circuitGraphRef.current.addComponent(x, y, type);
    const components = circuitGraphRef.current.getComponents()
    const ports = circuitGraphRef.current.getPorts()
    setVisualComponents([...components])
    setPorts([...ports])
  }

  function updateComponentPositionOnDrag(componentId: string, x: number, y: number) : void {
    circuitGraphRef.current.updatePositionOnDrag(componentId, x, y);
    const components = circuitGraphRef.current.getComponents()
    const ports = circuitGraphRef.current.getPorts()
    setVisualComponents([...components])
    setPorts([...ports])
  }

  const updateCanvas = () : void => {
      if (canvasContainerRef.current) {
        const { offsetWidth, offsetHeight } = canvasContainerRef.current;
        console.log(offsetHeight, offsetWidth)
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
                      return <OrGate key={component.id} componentId={component.id} updateComponentPositionOnDrag={updateComponentPositionOnDrag}/>
                  
                    case ComponentType.INPUT:
                      return <SimpleSwitch key={component.id} componentId={component.id} updateComponentPositionOnDrag={updateComponentPositionOnDrag}/>

                    case ComponentType.OUTPUT:
                      return <Bulb key={component.id} componentId={component.id} updateComponentPositionOnDrag={updateComponentPositionOnDrag}/>
                    
                    case ComponentType.WIRE:
                      return <Wire key={component.id} ports={ports}/>

                    default:
                      break;
                  }
                })
              }
            </Layer>
          </Stage>
        </div>
      </div>
    </>
  )
}