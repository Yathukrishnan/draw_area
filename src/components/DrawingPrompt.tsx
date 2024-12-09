import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { toast } from "sonner";
import { drawingPrompts } from "@/utils/drawingPrompts";

interface DrawingPromptProps {
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
}

export const DrawingPrompt = ({ currentPrompt, setCurrentPrompt }: DrawingPromptProps) => {
  const getNewPrompt = () => {
    const newPrompt = drawingPrompts[Math.floor(Math.random() * drawingPrompts.length)];
    setCurrentPrompt(newPrompt);
    toast("New drawing challenge! 🎨");
  };

  return (
    <div className="bg-secondary/50 p-4 rounded-lg shadow-md flex items-center gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Let's Draw Together:</h2>
        <p className="text-lg">{currentPrompt}</p>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={getNewPrompt}
        className="ml-4 hover:animate-spin"
        aria-label="Get new drawing prompt"
      >
        <Shuffle className="w-5 h-5" />
      </Button>
    </div>
  );
};