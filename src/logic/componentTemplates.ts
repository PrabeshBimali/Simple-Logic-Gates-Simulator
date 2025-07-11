import { ComponentType } from "@/types/types";


export interface ORGateDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
  pinLength: number;
  pinYOffset: number;
  inputAx: number;
  inputAy: number;
  inputBx: number;
  inputBy: number;
  outputx: number;
  outputy: number;
}

export interface ANDGateDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
  pinLength: number;
  pinYOffset: number;
  inputAx: number;
  inputAy: number;
  inputBx: number;
  inputBy: number;
  outputx: number;
  outputy: number;
}

export interface NOTGateDimensions {
  x: number;
  y: number;
  inputx: number,
  inputy: number,
  outputx: number,
  outputy: number
}


export interface InputDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
  pinLength: number;
  outputx: number;
  outputy: number;
}

export interface OutputDimensions {
  x: number;
  y: number;
  pinLength: number;
  inputx: number;
  inputy: number;
}

export interface WireDimensions {
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
}

export interface JunctionDimensions {
  portAx: number,
  portAy: number,
  portBx: number,
  portBy: number,
  portCx: number,
  portCy: number,
  portDx: number,
  portDy: number,
}

type ComponentTypeMap = {
  [ComponentType.OR]: ORGateDimensions;
  [ComponentType.AND]: ANDGateDimensions;
  [ComponentType.NOT]: NOTGateDimensions;
  [ComponentType.INPUT]: InputDimensions;
  [ComponentType.OUTPUT]: OutputDimensions;
  [ComponentType.WIRE]: WireDimensions;
  [ComponentType.JUNCTION]: JunctionDimensions
};

export function startPositionAndDimension<T extends keyof ComponentTypeMap>(
  componentType: T
): ComponentTypeMap[T] {
  const ioPinLength = 10;
  const ioPinYOffset = 20;
  const gateWidth = 120;
  const gateHeight = 100;

  const positions: ComponentTypeMap = {
    [ComponentType.OR]: {
      x: 400,
      y: 400,
      width: gateWidth,
      height: gateHeight,
      pinLength: ioPinLength,
      pinYOffset: ioPinYOffset,
      inputAx: -ioPinLength,
      inputAy: ioPinYOffset,
      inputBx: -ioPinLength,
      inputBy: gateHeight - ioPinYOffset,
      outputx: gateWidth + ioPinLength,
      outputy: gateHeight / 2
    },
    [ComponentType.AND]: {
      x: 400,
      y: 400,
      width: 100,
      height: 100,
      pinLength: ioPinLength,
      pinYOffset: ioPinYOffset,
      inputAx: -ioPinLength,
      inputAy: ioPinYOffset,
      inputBx: -ioPinLength,
      inputBy: 100 - ioPinYOffset,
      outputx: 100 + ioPinLength,
      outputy: 100 / 2
    },
    [ComponentType.NOT]: {
      x: 400,
      y: 400,
      inputx: -10,
      inputy: 40,
      outputx: 98,
      outputy: 40
    },
    [ComponentType.INPUT]: {
      x: 400,
      y: 400,
      width: 30,
      height: 30,
      pinLength: 15,
      outputx: 45,
      outputy: 15
    },
    [ComponentType.OUTPUT]: {
      x: 400,
      y: 400,
      pinLength: 10,
      inputx: -20,
      inputy: 0
    },
    [ComponentType.WIRE]: {
      x: 0,
      y: 0,
      x1: 210,
      y1: 120,
      x2: 300,
      y2: 120
    },
    [ComponentType.JUNCTION]: {
      portAx: 0,
      portAy: -20,
      portBx: 0,
      portBy: 20,
      portCx: -20,
      portCy: 0,
      portDx: 20,
      portDy: 0
    }
  };

  return positions[componentType];
}
