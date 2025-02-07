import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";

interface ModalSettingsProps {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  workHours: number;
  setWorkHours: (hours: number) => void;
  workMinutes: number;
  setWorkMinutes: (minutes: number) => void;
}

export function ModalSettings({ theme, setTheme, workHours, setWorkHours, workMinutes, setWorkMinutes }: ModalSettingsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Work Hours</Label>
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="24"
                  value={workHours}
                  onChange={(e) => setWorkHours(Number(e.target.value))}
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="minutes">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={workMinutes}
                  onChange={(e) => setWorkMinutes(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Dark Mode</Label>
            <Switch
              id="theme"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}