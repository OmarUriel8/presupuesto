import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = React.forwardRef<
  HTMLFormElement,
  React.HTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => <form ref={ref} className={cn("space-y-6", className)} {...props} />);
Form.displayName = "Form";

function FormField({
  control,
  name,
  children,
}: {
  control: unknown;
  name: string;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

function FormItem({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} />;
}

function FormLabel({ className }: React.HTMLAttributes<HTMLLabelElement>) {
  return <Label className={className} />;
}

function FormControl({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(className)} {...props} />;
}

function FormMessage({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <p className={cn("text-sm font-medium text-destructive", className)} />
  );
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };
