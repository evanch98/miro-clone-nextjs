import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

export const Loading = () => {
  return (
    <main className="h-full w-full bg-neutral-100 relative touch-none flex items-center justify-center">
      <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
    </main>
  );
};
