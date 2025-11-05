import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
    selected?: Date;
    onChange: (date: Date | undefined) => void;
    className?: string;
    defaultDate?: Date;
    disabled?: boolean; // Thêm thuộc tính disabled
}

const DatePicker: React.FC<DatePickerProps> = (props: DatePickerProps) => {
    const { selected, onChange, className, defaultDate = new Date(), disabled } = props;
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full">
            <Popover
                open={disabled ? false : open}
                onOpenChange={disabled ? undefined : setOpen}
            >
                <PopoverTrigger asChild>
                    <Button
                        className={cn(
                            "justify-start text-left font-normal w-full text-black border bg-white hover:bg-white",
                            !selected && "text-muted-foreground",
                            disabled && "opacity-50 cursor-not-allowed bg-[#79747E14] hover:bg-[#79747E14]",
                            className
                        )}
                        disabled={disabled}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selected ? (
                            format(selected, "dd/MM/yyyy", { locale: vi })
                        ) : (
                            <span>{format(defaultDate, "dd/MM/yyyy", { locale: vi })}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={selected}
                        onSelect={(date) => {
                            onChange(date);
                            setOpen(false);
                        }}
                        initialFocus
                        locale={vi}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DatePicker;