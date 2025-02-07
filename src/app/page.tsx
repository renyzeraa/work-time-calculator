"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "next-themes";
import { ModalSettings } from "@/components/modal-settings";
import { triggerConfetti } from "@/lib/confetti";

export default function Home() {
  const [morningEntry, setMorningEntry] = useState("");
  const [morningExit, setMorningExit] = useState("");
  const [afternoonEntry, setAfternoonEntry] = useState("");
  const [remainingTime, setRemainingTime] = useState<string | null>(null);
  const [leavingTime, setLeavingTime] = useState<string | null>(null);
  const [extraTime, setExtraTime] = useState<string | null>(null);
  const [useFlexTime, setUseFlexTime] = useState(false);
  const [workHours, setWorkHours] = useState(8);
  const [workMinutes, setWorkMinutes] = useState(48);
  const { theme, setTheme } = useTheme();

  const calculateTimes = () => {
    if (!morningEntry || !morningExit || !afternoonEntry) {
      return;
    }

    const [mEntryHours, mEntryMinutes] = morningEntry.split(":").map(Number);
    const [mExitHours, mExitMinutes] = morningExit.split(":").map(Number);
    const [aEntryHours, aEntryMinutes] = afternoonEntry.split(":").map(Number);

    const morningMinutes = (mExitHours * 60 + mExitMinutes) - (mEntryHours * 60 + mEntryMinutes);
    const currentTime = new Date();
    const afternoonMinutes = (currentTime.getHours() * 60 + currentTime.getMinutes()) - (aEntryHours * 60 + aEntryMinutes);

    const totalWorkedMinutes = morningMinutes + afternoonMinutes;
    const standardRequiredMinutes = workHours * 60 + workMinutes;

    // Calculate remaining minutes without flex time for extra time calculation
    const remainingMinutesNoFlex = standardRequiredMinutes - totalWorkedMinutes;

    // Calculate remaining minutes with flex time if enabled and not in extra time
    const remainingMinutesWithFlex = remainingMinutesNoFlex > 0 && useFlexTime
      ? remainingMinutesNoFlex - 10
      : remainingMinutesNoFlex;

    // Calculate leaving time using flex time if enabled
    const totalAfternoonMinutesNeeded = (useFlexTime ? standardRequiredMinutes - 10 : standardRequiredMinutes) - morningMinutes;
    const leavingTimeMinutes = (aEntryHours * 60 + aEntryMinutes) + totalAfternoonMinutesNeeded;
    const leavingHours = Math.floor(leavingTimeMinutes / 60);
    const leavingMinutes = leavingTimeMinutes % 60;
    setLeavingTime(
      `${String(leavingHours).padStart(2, '0')}:${String(leavingMinutes).padStart(2, '0')}`
    );

    if (remainingMinutesNoFlex <= 0) {
      setRemainingTime("You can leave now!");
      const extraMinutes = Math.abs(remainingMinutesNoFlex);
      const extraHours = Math.floor(extraMinutes / 60);
      const extraMins = extraMinutes % 60;
      setExtraTime(`+${extraHours}h ${extraMins}m extra`);
      triggerConfetti();
    } else {
      const hours = Math.floor(remainingMinutesWithFlex / 60);
      const minutes = remainingMinutesWithFlex % 60;
      setRemainingTime(`${hours}h ${minutes}m remaining`);
      setExtraTime(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-md mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Work Time Calculator</h1>
          </div>
          <ModalSettings
            theme={theme}
            setTheme={setTheme}
            workHours={workHours}
            setWorkHours={setWorkHours}
            workMinutes={workMinutes}
            setWorkMinutes={setWorkMinutes}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="morningEntry">Morning Entry</Label>
            <Input
              id="morningEntry"
              type="time"
              value={morningEntry}
              onChange={(e) => setMorningEntry(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="morningExit">Morning Exit</Label>
            <Input
              id="morningExit"
              type="time"
              value={morningExit}
              onChange={(e) => setMorningExit(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="afternoonEntry">Afternoon Entry</Label>
            <Input
              id="afternoonEntry"
              type="time"
              value={afternoonEntry}
              onChange={(e) => setAfternoonEntry(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="flexTime"
              checked={useFlexTime}
              onCheckedChange={(checked) => setUseFlexTime(checked as boolean)}
            />
            <Label htmlFor="flexTime">Use 10-minute flex time (leave at {workHours}:{String(workMinutes - 10).padStart(2, '0')})</Label>
          </div>

          <div className="space-y-4">
            {leavingTime && (
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <Label className="block mb-1">Expected Leaving Time</Label>
                <p className="text-xl font-semibold">{leavingTime}</p>
              </div>
            )}

            {remainingTime && (
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <Label className="block mb-1">Remaining Time</Label>
                <p className="text-xl font-semibold">{remainingTime}</p>
                {extraTime && (
                  <p className="text-lg font-medium text-green-600 dark:text-green-400 mt-1">
                    {extraTime}
                  </p>
                )}
              </div>
            )}
          </div>

          <Button
            className="w-full"
            onClick={calculateTimes}
          >
            Calculate Times
          </Button>
        </div>
      </Card>
    </div>
  );
}