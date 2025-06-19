"use client"

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
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
    try {
      circuitGraphRef.current.addComponent(x, y, type);
      const components = circuitGraphRef.current.getComponents()
      const ports = circuitGraphRef.current.getPorts()
      const wires = circuitGraphRef.current.getWires()
      setVisualComponents([...components])
      setPorts([...ports])
      setWires([...wires])
    } catch(e) {
      console.error(e)
      return
    }
  }

  function updateComponentPositionOnDrag(componentId: string, x: number, y: number) : void {
    try {
      circuitGraphRef.current.updateComponentPositionOnDragEnd(componentId, x, y);
      const components = circuitGraphRef.current.getComponents()
      const ports = circuitGraphRef.current.getPorts()
      setVisualComponents([...components])
      setPorts([...ports])
    } catch(e) {
      console.error(e)
      return
    }
  }

  function onNewWireToComponentConnection(portId: string, wireEndPointId: string): void {
    try {
      circuitGraphRef.current.addNewWireToComponentConnection(portId, wireEndPointId);
      const components = circuitGraphRef.current.getComponents()
      const ports = circuitGraphRef.current.getPorts()
      setVisualComponents([...components])
      setPorts([...ports])
    } catch(e) {
      console.error(e)
      return
    }
  }

  function onWireEndPointDragged(wireEndPointId: string, x: number, y: number) {
    try {
      circuitGraphRef.current.updateWireEndPointPositionOnDrag(wireEndPointId, x, y)
      const wires = circuitGraphRef.current.getWires()
      setWires([...wires])
    } catch (e) {
      console.error(e)
      return
    }
  }

  function updateConnectedWirePositionOnComponentDrag(componentId: string, x: number, y: number) {
    try {
      circuitGraphRef.current.updateConnectedWireEndPointPositionOnComponentDrag(componentId, x, y)
      const wires = circuitGraphRef.current.getWires()
      setWires(wires)
    } catch(e) {
      console.error(e)
      return
    }
  }

  function onSwitchClicked(componentId: string): void {
    try {
      circuitGraphRef.current.updateValueOnSwitchClicked(componentId)
      const components = circuitGraphRef.current.getComponents()
      setVisualComponents([...components])
    } catch(e) {
      console.error(e)
      return
    }
  }

  function onSelectOrDeselectAComponent(componentId: string) : void {
    try {
      circuitGraphRef.current.selectOrDeselectAComponent(componentId)
      const components = circuitGraphRef.current.getComponents()
      setVisualComponents([...components])
    } catch(e) {
      console.error(e)
      return
    }
  }

  function onSelectOrDeselectAWire(wireId: string): void {
    try {
      circuitGraphRef.current.selectOrDiselectAWire(wireId)
      const newWires: WireType[] = circuitGraphRef.current.getWires()
      setWires([...newWires])
    } catch(e) {
      console.error(e)
      return
    }
  }

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

  //const updateCanvas = () : void => {
  //    if (canvasContainerRef.current) {
  //      const { offsetWidth, offsetHeight } = canvasContainerRef.current;
  //      setDimensions({ width: offsetWidth, height: offsetHeight });
  //    }
  //  };

  //// TODO: FIX canvas size on resize
  //useEffect(() => {
  //  updateCanvas();
  //  window.addEventListener("resize", updateCanvas);
  //  return () => window.removeEventListener("resize", updateCanvas);
  //}, []);

  const updateCanvas = () : void => {
    if (canvasContainerRef.current) {
      const { clientWidth, clientHeight } = canvasContainerRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
    }
  };

  useEffect(() => {
    let frame: number;

    const handleResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateCanvas);
    };

    window.addEventListener("resize", handleResize);
    updateCanvas();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className='flex h-screen'>
        <div className='w-24 bg-gray-100'>
          <Toolbar addNewComponent={addNewComponent}/>
        </div>
        <div className='grow' ref={canvasContainerRef}>
          <Stage 
            width={dimensions.width} 
            height={dimensions.height}
          >
            <Layer>
              <Rect
                x={0}
                y={0}
                width={dimensions.width}
                height={dimensions.height}
                fill="white"
              />
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
            </Layer>
          </Stage>
        </div>
      </div>
    </>
  )
}