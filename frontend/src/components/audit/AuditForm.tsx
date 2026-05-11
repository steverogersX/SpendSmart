"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolEntry } from "./ToolEntry";

import { apiToolSchema, toolSchema } from "@shared/schemas/auditRequest";
import { runAudit } from "@/lib/api";
import { AuditResult } from "@shared/types/auditResult";
import { AuditResults } from "./AuditResults";

const apiEntrySchema = apiToolSchema;
const subscriptionEntrySchema = toolSchema;

export const entrySchema = z.discriminatedUnion("type", [
  apiEntrySchema,
  subscriptionEntrySchema,
]);

const formSchema = z.object({
  tools: z
    .array(entrySchema)
    .min(1, "Add at least one tool to audit")
    .max(8, "You can audit up to 8 tools at once"),
});

export type FormValues = z.input<typeof formSchema>;

function AuditForm() {
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
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
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
              variant="outline"
              disabled={isLoading}
              className="
              mx-auto h-9 rounded-xl
              bg-black px-4 text-sm font-medium text-white
              shadow-sm transition-all duration-200
              hover:bg-neutral-800 hover:shadow-md
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-70
              "
            >
              <div className="flex items-center gap-2">
                {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}

                <span>{isLoading ? "Running Audit..." : "Run Audit"}</span>
              </div>
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

export default AuditForm;
