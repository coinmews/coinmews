"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  showTimeSelect?: boolean;
}

export function DateTimePicker({
  date,
  setDate,
  className,
  placeholder = "Select date and time",
  showTimeSelect = true,
}: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<{
    hours: string;
    minutes: string;
  }>({
    hours: date ? format(date, "HH") : "00",
    minutes: date ? format(date, "mm") : "00",
  });

  // Update the date when time changes
  React.useEffect(() => {
    if (date && selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(selectedTime.hours));
      newDate.setMinutes(parseInt(selectedTime.minutes));
      setDate(newDate);
    }
  }, [selectedTime, date, setDate]);

  // Generate hours options (00-23)
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Generate minutes options (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <div className={cn("relative", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, showTimeSelect ? "PPP HH:mm" : "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
          {showTimeSelect && date && (
            <div className="border-t border-border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={selectedTime.hours}
                    onValueChange={(value) =>
                      setSelectedTime({ ...selectedTime, hours: value })
                    }
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-lg">:</span>
                  <Select
                    value={selectedTime.minutes}
                    onValueChange={(value) =>
                      setSelectedTime({ ...selectedTime, minutes: value })
                    }
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {minutes.map((minute) => (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0", className)}>
      <DateTimePicker
        date={startDate}
        setDate={onStartDateChange}
        placeholder="Start date"
        className="flex-1"
      />
      <DateTimePicker
        date={endDate}
        setDate={onEndDateChange}
        placeholder="End date"
        className="flex-1"
      />
    </div>
  );
}
