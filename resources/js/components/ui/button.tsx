import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#16c42d] text-white shadow-xs hover:bg-[#13a825] shadow-[inset_0_-4px_0_rgba(15,166,23,0.3)] border-2 border-[#0c9d1f]",
        destructive:
          "bg-[#ff2727] text-white shadow-xs hover:bg-[#e61e1e] shadow-[inset_0_-4px_0_rgba(204,20,20,0.3)] border-2 border-[#cc1414] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-2 border-[#d0d0d0] bg-transparent text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground shadow-[inset_0_-4px_0_rgba(150,150,150,0.1)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 shadow-[inset_0_-3px_0_rgba(0,0,0,0.3)]",
        ghost: "border-2 border-[#e6e6e6] hover:bg-accent hover:text-accent-foreground shadow-[inset_0_-5px_0_rgba(0,0,0,0.2]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
