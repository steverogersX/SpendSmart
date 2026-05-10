'use client'

import { Input as InputPrimitive } from '@base-ui/react/input'
import { cn } from '@/lib/utils'

type InputProps = React.ComponentPropsWithoutRef<typeof InputPrimitive>

function Input({ className, ...props }: InputProps) {
  return (
    <InputPrimitive
      className={cn(
        'flex h-10 w-full rounded-lg border border-border bg-input/30 px-3 py-2 text-sm text-foreground shadow-xs',
        'placeholder:text-muted-foreground/60',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
