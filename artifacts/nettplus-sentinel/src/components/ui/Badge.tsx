import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline" | "netlife" | "puntonet" | "celerity" | "cnt";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary/20 text-primary border border-primary/30",
    success: "bg-success/20 text-success border border-success/30",
    warning: "bg-warning/20 text-warning border border-warning/30",
    destructive: "bg-destructive/20 text-destructive border border-destructive/30",
    outline: "bg-transparent border border-muted-foreground text-muted-foreground",
    netlife: "bg-comp-netlife/20 text-comp-netlife border border-comp-netlife/30",
    puntonet: "bg-comp-puntonet/20 text-comp-puntonet border border-comp-puntonet/30",
    celerity: "bg-comp-celerity/20 text-comp-celerity border border-comp-celerity/30",
    cnt: "bg-comp-cnt/20 text-comp-cnt border border-comp-cnt/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
