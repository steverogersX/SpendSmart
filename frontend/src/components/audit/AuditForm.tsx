"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ToolEntry } from "./ToolEntry";
import { apiToolSchema, toolSchema } from "@shared/schemas/audit";

const apiEntrySchema = apiToolSchema;
const subscriptionEntrySchema = toolSchema;

export const entrySchema = z.discriminatedUnion("type", [
  apiEntrySchema,
  subscriptionEntrySchema,
]);

const formSchema = z.object({
  tools: z.array(entrySchema).min(1).max(8),
});

export type FormValues = z.input<typeof formSchema>;

export function AuditForm() {
  const methods = useForm<FormValues, unknown, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tools: [
        {
          type: "subscription",
          tool: "",
          useCase: "",
          plan: "",
          seats: 1,
          monthlySpend: 0,
        },
      ],
    },
  });

  function onSubmit(values: z.output<typeof formSchema>) {
    console.log({ tools: values.tools });
    // TODO: call POST /audit API
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <ToolEntry />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" size="sm" className="m-auto gap-1.5 p-1.5">
            Run Audit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
