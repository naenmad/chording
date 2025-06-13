'use client';

import { useEffect, useRef } from 'react';

interface ChordDiagramProps {
    chord: string;
    fingering: string;
    size?: number;
}

const ChordDiagram = ({ chord, fingering, size = 120 }: ChordDiagramProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);                // Set canvas size with more height for proper spacing
                canvas.width = size;
                canvas.height = size * 1.4; // Increase height ratio

                drawChordDiagram(ctx, fingering, canvas.width, canvas.height);
            }
        }
    }, [chord, fingering, size]);    const drawChordDiagram = (ctx: CanvasRenderingContext2D, fingering: string, width: number, height: number) => {
        const strings = 6;
        const frets = 4;
        const margin = 30; // Increase margin for better spacing
        const topMargin = 40; // Extra space for open strings/muted strings
        const fretWidth = (width - 2 * margin) / (strings - 1);
        const fretHeight = (height - topMargin - margin) / frets;

        // Set styles
        ctx.strokeStyle = '#333';
        ctx.fillStyle = '#333';
        ctx.lineWidth = 2;

        // Draw vertical lines (strings)
        for (let i = 0; i < strings; i++) {
            const x = margin + i * fretWidth;
            ctx.beginPath();
            ctx.moveTo(x, topMargin);
            ctx.lineTo(x, topMargin + frets * fretHeight);
            ctx.stroke();
        }

        // Draw horizontal lines (frets)
        for (let i = 0; i <= frets; i++) {
            const y = topMargin + i * fretHeight;
            ctx.beginPath();
            ctx.moveTo(margin, y);
            ctx.lineTo(margin + (strings - 1) * fretWidth, y);
            ctx.stroke();
        }

        // Draw nut (thick line at top)
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(margin, topMargin);
        ctx.lineTo(margin + (strings - 1) * fretWidth, topMargin);
        ctx.stroke();

        // Parse and draw finger positions
        const positions = fingering.split('');
        positions.forEach((pos, stringIndex) => {
            const x = margin + stringIndex * fretWidth;

            if (pos === 'x') {
                // Draw X for muted string
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 3;
                const size = 8;
                const yPos = topMargin - 20; // Position above nut
                ctx.beginPath();
                ctx.moveTo(x - size, yPos - size);
                ctx.lineTo(x + size, yPos + size);
                ctx.moveTo(x + size, yPos - size);
                ctx.lineTo(x - size, yPos + size);
                ctx.stroke();
            } else if (pos === '0') {
                // Draw open string (circle)
                ctx.strokeStyle = '#333';
                ctx.fillStyle = 'white';
                ctx.lineWidth = 2;
                const yPos = topMargin - 20; // Position above nut
                ctx.beginPath();
                ctx.arc(x, yPos, 7, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            } else {
                // Draw finger position (filled circle)
                const fretNum = parseInt(pos);
                if (fretNum > 0 && fretNum <= frets) {
                    const y = topMargin + (fretNum - 0.5) * fretHeight;
                    ctx.fillStyle = '#0f766e';
                    ctx.beginPath();
                    ctx.arc(x, y, 8, 0, 2 * Math.PI);
                    ctx.fill();

                    // Add fret number
                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(pos, x, y + 4);
                }
            }
        });

        ctx.strokeStyle = '#333';
        ctx.fillStyle = '#333';
    };    return (
        <div className="chord-diagram-container text-center">
            <div className="chord-name text-lg font-bold text-[#1A2A3A] mb-2">
                {chord}
            </div>
            <div className="chord-canvas bg-white rounded-lg p-4 shadow-sm border overflow-visible">
                <canvas
                    ref={canvasRef}
                    className="mx-auto block"
                    style={{ 
                        maxWidth: '100%', 
                        height: 'auto',
                        display: 'block'
                    }}
                />
            </div>
            <div className="fingering-text text-xs text-gray-500 mt-2 font-mono">
                {fingering}
            </div>
        </div>
    );
};

export default ChordDiagram;
