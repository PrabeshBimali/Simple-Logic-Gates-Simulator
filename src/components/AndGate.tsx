import { Shape } from 'react-konva';

export default function AndGate() {
    return (
        <Shape
            width={100}
            height={100}
            sceneFunc={(context, shape) => {
              const width = shape.width();   // total width of the gate
              const height = shape.height(); // total height of the gate
              const radius = height / 2;

              context.beginPath();

              // Left vertical line
              context.moveTo(0, 0);
              context.lineTo(0, height);

              // Bottom horizontal line to the arc start
              context.lineTo(width - radius, height);

              // Right side arc (half-circle)
              context.arc(width - radius, height / 2, radius, Math.PI / 2, -Math.PI / 2, true);

              // Top line back to start
              context.lineTo(0, 0);

              context.closePath();
              context.fillStrokeShape(shape);
            }}
            fill="#00D2FF"
            stroke="black"
            strokeWidth={2}
            draggable
        />

    )
}