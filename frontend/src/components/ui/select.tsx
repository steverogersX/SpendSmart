'use client'

import * as React from 'react'
import { Select } from '@base-ui/react/select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectFieldProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

function SelectField({
  value,
  onValueChange,
  placeholder,
  disabled,
  className,
  children,
}: SelectFieldProps) {
  return (
    <Select.Root value={value ?? null} onValueChange={(v) => v !== null && onValueChange?.(v)} disabled={disabled}>
      <Select.Trigger
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-border bg-input/30 px-3 py-2 text-sm',
          'text-foreground shadow-xs transition-colors duration-150',
          'hover:bg-input/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[popup-open]:ring-2 data-[popup-open]:ring-ring/50 data-[popup-open]:border-ring',
          !value && 'text-muted-foreground/60',
          className,
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[popup-open]:rotate-180" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner sideOffset={6}>
          <Select.Popup
            className={cn(
              'z-50 min-w-[var(--anchor-width)] overflow-hidden rounded-xl border border-border',
              'bg-popover text-popover-foreground shadow-lg',
              'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
              'data-[starting-style]:scale-95 data-[ending-style]:scale-95',
              'transition-[opacity,transform] duration-150 ease-out',
              'origin-[var(--transform-origin)]',
            )}
          >
            <Select.List className="p-1.5 max-h-64 overflow-y-auto">
              {children}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}

interface SelectOptionProps {
  value: string
  label: string
}

function SelectOption({ value, label }: SelectOptionProps) {
  return (
    <Select.Item
      value={value}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none',
        'text-popover-foreground select-none',
        'transition-colors duration-100',
        'hover:bg-accent hover:text-accent-foreground',
        'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
        'data-[selected]:font-medium',
      )}
    >
      <Select.ItemIndicator className="flex size-4 items-center justify-center">
        <Check className="size-3.5" />
      </Select.ItemIndicator>
      <Select.ItemText>{label}</Select.ItemText>
    </Select.Item>
  )
}

export { SelectField, SelectOption }
