"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolEntry } from "./ToolEntry";
import { AuditResults } from "./AuditResults";
import { apiToolSchema, toolSchema } from "@shared/schemas/audit";
import { runAudit } from "@/lib/api";
import { AuditResult } from "@shared/types/auditResult";

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
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (status === "success") {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [status]);

  async function onSubmit(values: z.output<typeof formSchema>) {
    setStatus("loading");
    setResult(null);
    setErrorMsg(null);
    try {
      const data = await runAudit(values.tools);
      setResult(data);
      setStatus("success");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  }

  const isLoading = status === "loading";

  return (
    <div className="space-y-6">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <ToolEntry />

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="m-auto gap-1.5 p-1.5"
            >
              {isLoading && <Loader2 className="size-3.5 animate-spin" />}
              {isLoading ? "Running..." : "Run Audit"}
            </Button>
          </div>
        </form>
      </FormProvider>

      {status === "error" && errorMsg && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}

      {status === "success" && result && (
        <div ref={resultsRef}>
          <AuditResults result={result} />
        </div>
      )}
    </div>
  );
}
