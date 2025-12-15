import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary:
                    "bg-primary-500 text-white shadow hover:bg-primary-600 active:scale-95",
                secondary:
                    "bg-accent-500 text-white shadow hover:bg-accent-600 active:scale-95",
                outline:
                    "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:scale-95",
                ghost: "hover:bg-muted hover:text-foreground",
                link: "text-primary-500 underline-offset-4 hover:underline",
            },
            size: {
                sm: "h-9 px-3 text-xs",
                md: "h-11 px-6",
                lg: "h-13 px-8 text-base",
                xl: "h-16 px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
