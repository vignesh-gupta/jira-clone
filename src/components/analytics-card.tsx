import React from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

type AnalyticsCardProps = {
  title: string;
  value: number;
  trend: "up" | "down";
  increaseValue: number;
};

const AnalyticsCard = ({
  increaseValue,
  title,
  trend,
  value,
}: AnalyticsCardProps) => {
  const trendColor = trend === "up" ? "text-emerald-500" : "text-red-500";
  const Icon = trend === "up" ? FaCaretUp : FaCaretDown;

  return (
    <Card className="shadow-none border-none w-full">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="text-base truncate">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={`size-4 ${trendColor}`} />
            <span className={cn("truncate text-base font-medium", trendColor)}>
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default AnalyticsCard;
