import { cn } from "@/lib/utils";

export const Spinner = ({ className, size = "default" }: { className?: string; size?: "sm" | "default" | "lg" }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    default: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
          sizes[size]
        )} 
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
