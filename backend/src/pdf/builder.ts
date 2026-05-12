import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { AuditResult } from '@shared/types/auditResult';
import type { PdfMeta } from './types';
import { AuditReport } from './templates/AuditReport';

export function buildPdfHtml(result: AuditResult, meta: PdfMeta): string {
  const markup = renderToStaticMarkup(createElement(AuditReport, { result, meta }));
  return `<!DOCTYPE html>${markup}`;
}
