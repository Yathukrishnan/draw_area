import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, PencilBrush } from "fabric";
import { Button } from "@/components/ui/button";
import { Paintbrush, Square, Circle as CircleIcon, Eraser, Trophy, Pencil, Pen, PaintBucket, Move } from "lucide-react";
import { toast } from "sonner";
import { drawingPrompts } from "@/utils/drawingPrompts";
import { DrawingPrompt } from "./DrawingPrompt";

export const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#9b87f5");
  const [activeTool, setActiveTool] = useState<"draw" | "rectangle" | "circle" | "eraser" | "pencil" | "pen" | "fill">("draw");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState(() => 
    drawingPrompts[Math.floor(Math.random() * drawingPrompts.length)]
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
    }

    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = activeColor;
    
    // Add click handler for fill tool
    canvas.on('mouse:down', (options) => {
      if (activeTool === 'fill' && options.target) {
        options.target.set('fill', activeColor);
        canvas.renderAll();
        checkAchievement("Color Master!");
      }
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas || !fabricCanvas.freeDrawingBrush) return;

    if (activeTool === "eraser") {
      fabricCanvas.freeDrawingBrush.color = "#ffffff";
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush.width = 20;
    } else if (activeTool === "draw") {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = 5;
      fabricCanvas.isDrawingMode = true;
    } else if (activeTool === "pencil") {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = 2;
      fabricCanvas.isDrawingMode = true;
    } else if (activeTool === "pen") {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = 8;
      fabricCanvas.isDrawingMode = true;
    } else {
      fabricCanvas.isDrawingMode = false;
    }
  }, [activeTool, activeColor, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (tool === "rectangle" && fabricCanvas) {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 100,
        height: 100,
      });
      fabricCanvas.add(rect);
      checkAchievement("First Shape!");
    } else if (tool === "circle" && fabricCanvas) {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: activeColor,
        radius: 50,
      });
      fabricCanvas.add(circle);
      checkAchievement("Circle Master!");
    } else if (tool === "pencil") {
      checkAchievement("Pencil Artist!");
    } else if (tool === "pen") {
      checkAchievement("Pen Master!");
    }
  };

  const checkAchievement = (achievement: string) => {
    if (!achievements.includes(achievement)) {
      setAchievements([...achievements, achievement]);
      toast("🎉 New Achievement Unlocked: " + achievement);
    }
  };

  const colors = ["#9b87f5", "#FDE1D3", "#0EA5E9", "#F97316", "#D946EF"];

  const getNewPrompt = () => {
    const newPrompt = drawingPrompts[Math.floor(Math.random() * drawingPrompts.length)];
    setCurrentPrompt(newPrompt);
    toast("New drawing challenge! 🎨");
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 animate-scale-in">
      <h1 className="text-4xl font-bold text-primary">Fun Drawing Time! 🎨</h1>
      
      <DrawingPrompt 
        currentPrompt={currentPrompt}
        setCurrentPrompt={setCurrentPrompt}
      />
      
      <div className="flex gap-4 mb-4">
        {colors.map((color) => (
          <button
            key={color}
            className="w-12 h-12 rounded-full border-4 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
            style={{
              backgroundColor: color,
              borderColor: activeColor === color ? "#000" : "transparent",
            }}
            onClick={() => setActiveColor(color)}
          />
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <Button
          variant={activeTool === "draw" ? "default" : "outline"}
          size="lg"
          onClick={() => handleToolClick("draw")}
        >
          <Paintbrush className="w-6 h-6" />
        </Button>
        <Button
          variant={activeTool === "pencil" ? "default" : "outline"}
          size="lg"
          onClick={() => handleToolClick("pencil")}
        >
          <Pencil className="w-6 h-6" />
        </Button>
        <Button
          variant={activeTool === "pen" ? "default" : "outline"}
          size="lg"
          onClick={() => handleToolClick("pen")}
        >
          <Pen className="w-6 h-6" />
        </Button>
        <Button
          variant={activeTool === "fill" ? "default" : "outline"}
          size="lg"
          onClick={() => handleToolClick("fill")}
        >
          <Move className="w-6 h-6" />
        </Button>
        <Button
          variant={activeTool === "rectangle" ? "default" : "outline"}
          size="lg"
          onClick={() => handleToolClick("rectangle")}
        >
          <Square className="w-6 h-6" />
        </Button>
        <Button
          variant={activeTool === "circle" ? "default" : "outline"}
          size="lg"
          onClick={() => handleToolClick("circle")}
        >
          <CircleIcon className="w-6 h-6" />
        </Button>
        <Button
          variant={activeTool === "eraser" ? "default" : "outline"}
          size="lg"
          onClick={() => handleToolClick("eraser")}
        >
          <Eraser className="w-6 h-6" />
        </Button>
      </div>

      <div className="border-4 border-primary rounded-lg shadow-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>

      {achievements.length > 0 && (
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Achievements</h2>
          </div>
          <ul className="list-disc list-inside">
            {achievements.map((achievement) => (
              <li key={achievement} className="text-lg">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
