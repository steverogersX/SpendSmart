
import {ApiAuditResult, AuditResult, AuditResultItem} from "@shared/types/auditResult"

export function isApiResult(r: AuditResultItem): r is ApiAuditResult {
  return "primaryModel" in r;
}

export async function runAudit(tools: unknown[]): Promise<AuditResult> {
  const res = await fetch(`/api/v1/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tools }),
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error?.message ?? "Audit failed");
  }

  return json.data as AuditResult;
}
