"use client";

import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectField, SelectOption } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tools,
  PlansByTool,
  ModelsByTool,
  UseCases,
} from "@shared/config/tools.config";
import { cn } from "@/lib/utils";
import type { FormValues } from "./AuditForm";
import { useCallback, useEffect, useState } from "react";

const SUBSCRIPTION_TOOLS = [
  { value: Tools.Cursor, label: "Cursor" },
  { value: Tools.GithubCopilot, label: "GitHub Copilot" },
  { value: Tools.Claude, label: "Claude" },
  { value: Tools.ChatGPT, label: "ChatGPT" },
  { value: Tools.Gemini, label: "Gemini" },
  { value: Tools.Windsurf, label: "Windsurf" },
];

const API_TOOLS = [
  { value: Tools.AnthropicAPI, label: "Anthropic API" },
  { value: Tools.OpenAIAPI, label: "OpenAI API" },
  { value: Tools.KimiAPI, label: "Kimi API" },
  { value: Tools.DeepseekAPI, label: "Deepseek API" },
];

const USE_CASES = Object.entries(UseCases).map(([key, value]) => ({
  value,
  label: key,
}));

function formatLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const TOGGLE_OPTIONS = [
  { value: "subscription" as const, label: "Monthly Subscription" },
  { value: "api" as const, label: "API Usage" },
];

function ToolItem({
  index,
  onRemove,
  type,
}: {
  index: number;
  onRemove?: () => void;
  type: "subscription" | "api";
}) {
  const {
    watch,
    setValue,
    register,
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  const selectedTool = watch(`tools.${index}.tool`);

  const entryErrors = errors.tools?.[index] as
    | Record<string, { message?: string }>
    | undefined;

  const subscriptionPlans =
    selectedTool && type === "subscription"
      ? ((PlansByTool[selectedTool as keyof typeof PlansByTool] as string[]) ??
        [])
      : [];

  const subscriptionPlanItems = subscriptionPlans.map((plan) => ({
    value: plan,
    label: formatLabel(plan),
  }));

  const apiModels =
    selectedTool && type === "api"
      ? ((ModelsByTool[
          selectedTool as keyof typeof ModelsByTool
        ] as string[]) ?? [])
      : [];

  const apiModelItems = apiModels.map((model) => ({
    value: model,
    label: model,
  }));

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6">
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Fields — animated on type change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.17 }}
            className="space-y-4"
          >
            {type === "subscription" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Tool</Label>
                    <Controller
                      name={`tools.${index}.tool`}
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          value={field.value}
                          onValueChange={(v) => {
                            field.onChange(v);
                            setValue(`tools.${index}.plan`, "");
                          }}
                          placeholder="Select tool"
                          items={SUBSCRIPTION_TOOLS}
                        >
                          {SUBSCRIPTION_TOOLS.map((t) => (
                            <SelectOption
                              key={t.value}
                              value={t.value}
                              label={t.label}
                            />
                          ))}
                        </SelectField>
                      )}
                    />
                    {entryErrors?.tool?.message && (
                      <p className="text-xs text-destructive">
                        {entryErrors.tool.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Plan</Label>
                    <Controller
                      name={`tools.${index}.plan`}
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          key={selectedTool}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder={
                            selectedTool ? "Select plan" : "Select tool first"
                          }
                          disabled={!selectedTool}
                          items={subscriptionPlanItems}
                        >
                          {subscriptionPlans.map((plan) => (
                            <SelectOption
                              key={plan}
                              value={plan}
                              label={formatLabel(plan)}
                            />
                          ))}
                        </SelectField>
                      )}
                    />
                    {entryErrors?.plan?.message && (
                      <p className="text-xs text-destructive">
                        {entryErrors.plan.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Seats</Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="1"
                      {...register(`tools.${index}.seats`, {
                        valueAsNumber: true,
                      })}
                    />
                    {entryErrors?.seats?.message && (
                      <p className="text-xs text-destructive">
                        {entryErrors.seats.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Monthly Spend</Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        className="pl-6"
                        {...register(`tools.${index}.monthlySpend`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    {entryErrors?.monthlySpend?.message && (
                      <p className="text-xs text-destructive">
                        {entryErrors.monthlySpend.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Use Case</Label>
                  <Controller
                    name={`tools.${index}.useCase`}
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select use case"
                        items={USE_CASES}
                      >
                        {USE_CASES.map((uc) => (
                          <SelectOption
                            key={uc.value}
                            value={uc.value}
                            label={uc.label}
                          />
                        ))}
                      </SelectField>
                    )}
                  />
                  {entryErrors?.useCase?.message && (
                    <p className="text-xs text-destructive">
                      {entryErrors.useCase.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Provider</Label>
                    <Controller
                      name={`tools.${index}.tool`}
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          value={field.value}
                          onValueChange={(v) => {
                            field.onChange(v);
                            setValue(`tools.${index}.primaryModel`, "");
                          }}
                          placeholder="Select provider"
                          items={API_TOOLS}
                        >
                          {API_TOOLS.map((t) => (
                            <SelectOption
                              key={t.value}
                              value={t.value}
                              label={t.label}
                            />
                          ))}
                        </SelectField>
                      )}
                    />
                    {entryErrors?.tool?.message && (
                      <p className="text-xs text-destructive">
                        {entryErrors.tool.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Primary Model</Label>
                    <Controller
                      name={`tools.${index}.primaryModel`}
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          key={selectedTool}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder={
                            selectedTool
                              ? "Select model"
                              : "Select provider first"
                          }
                          disabled={!selectedTool}
                          items={apiModelItems}
                        >
                          {apiModels.map((model) => (
                            <SelectOption
                              key={model}
                              value={model}
                              label={model}
                            />
                          ))}
                        </SelectField>
                      )}
                    />
                    {entryErrors?.primaryModel?.message && (
                      <p className="text-xs text-destructive">
                        {entryErrors.primaryModel.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Average Monthly Spend</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      className="pl-6"
                      {...register(`tools.${index}.averageMonthlySpend`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  {entryErrors?.averageMonthlySpend?.message && (
                    <p className="text-xs text-destructive">
                      {entryErrors.averageMonthlySpend.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Capacity Buffer</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        placeholder="5"
                        className="pr-8"
                        {...register(`tools.${index}.dropCapacityBy`, {
                          valueAsNumber: true,
                        })}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        %
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Allow models this much lower in benchmarks
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label>
                      Context Window{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="e.g. 128000"
                      {...register(`tools.${index}.contextWindow`, {
                        setValueAs: (v: string) =>
                          v === "" ? undefined : Number(v),
                      })}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3">
                  <Controller
                    name={`tools.${index}.okayWithChineseModals`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`chinese-models-${index}`}
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <div className="space-y-0.5">
                    <Label
                      htmlFor={`chinese-models-${index}`}
                      className="cursor-pointer font-normal"
                    >
                      OK with Chinese AI models
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      May offer significantly lower pricing (e.g. DeepSeek,
                      Qwen)
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Use Case</Label>
                  <Controller
                    name={`tools.${index}.useCase`}
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select use case"
                        items={USE_CASES}
                      >
                        {USE_CASES.map((uc) => (
                          <SelectOption
                            key={uc.value}
                            value={uc.value}
                            label={uc.label}
                          />
                        ))}
                      </SelectField>
                    )}
                  />
                  {entryErrors?.useCase?.message && (
                    <p className="text-xs text-destructive">
                      {entryErrors.useCase.message}
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export function ToolEntry(): React.ReactElement {
  const { control } = useFormContext<FormValues>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "tools",
  });
  const [type, setType] = useState<"subscription" | "api">("subscription");


  const defaultEntry = useCallback((): FormValues["tools"][0] => {
    if (type === "subscription") {
      return {
        type: "subscription",
        tool: "",
        useCase: "",
        plan: "",
        seats: 1,
        monthlySpend: 0,
      };
    }

    return {
      type: "api",
      tool: Tools.OpenAIAPI,
      useCase: "",
      primaryModel: "",
      averageMonthlySpend: 0,
      dropCapacityBy: 5,
      okayWithChineseModals: false,
      contextWindow: undefined,
    };
  }, [type]);

  useEffect((): void => {
    replace([defaultEntry()]);
  }, [type, replace, defaultEntry]);

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="mb-6">
        <div className="relative flex w-fit rounded-xl bg-muted p-1">
          {TOGGLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={cn(
                "relative rounded-lg px-5 py-2 text-sm font-medium transition-colors duration-200",
                type === opt.value
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {type === opt.value && (
                <motion.div
                  layoutId="toggle-pill"
                  className="absolute inset-0 rounded-lg bg-background shadow-sm"
                  transition={{
                    type: "spring",
                    bounce: 0.18,
                    duration: 0.38,
                  }}
                />
              )}
              <span className="relative">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {fields.map((field, index) => (
        <ToolItem
          type={type}
          key={field.id}
          index={index}
          onRemove={fields.length > 1 ? () => remove(index) : undefined}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => append(defaultEntry())}
      >
        <Plus />
        Add More
      </Button>
    </div>
  );
}
