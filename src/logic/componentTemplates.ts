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

type ComponentTypeMap = {
  [ComponentType.OR]: ORGateDimensions;
  [ComponentType.INPUT]: InputDimensions;
  [ComponentType.OUTPUT]: OutputDimensions;
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
    [ComponentType.INPUT]: {
      x: 400,
      y: 400,
      width: 20,
      height: 20,
      pinLength: 10,
      outputx: 30,
      outputy: 10
    },
    [ComponentType.OUTPUT]: {
      x: 400,
      y: 400,
      pinLength: 10,
      inputx: -20,
      inputy: 0
    }
  };

  return positions[componentType];
}
