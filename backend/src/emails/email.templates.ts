import * as React from 'react';
import { render } from '@react-email/render';
import type { AuditResult } from '@shared/types/auditResult';
import FullAuditReport from './templates/FullAuditReport';

export async function buildEmailHtml(
  auditResult: AuditResult,
): Promise<string> {
  return render(React.createElement(FullAuditReport, {  auditResult }));
}
