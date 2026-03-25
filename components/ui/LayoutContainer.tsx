import * as React from "react"
import { cn } from "@/lib/utils"

export function LayoutContainer({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  )
}
