import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base: Added transition-all with a custom cubic-bezier for a "snappy" feel
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-white/20 active:scale-[0.96]",
  {
    variants: {
      variant: {
        // High-contrast primary: Pure white with a subtle lift on hover
        default: "bg-white text-black hover:bg-[#EAEAEA] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]",
        // Sleek Dark: Glass effect with border highlighting
        secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
        // Outline: Thin border that glows on hover
        outline: "border border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-white/40",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5",
        destructive: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
        link: "text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base rounded-full", // Hero-style buttons
        icon: "size-10",
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
  variant = "default",
  size = "default",
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
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
