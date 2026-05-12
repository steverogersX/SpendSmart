import { Request, Response, NextFunction } from 'express';
import { status } from 'http-status';
import { auditResultSchema } from '@shared/schemas/auditResults';
import { buildPdfHtml, renderPdf, PdfMeta } from '@/services/pdf.service';
import { ApiError } from '@/types';

interface PdfExportBody {
  result: unknown;
  meta: {
    date: string;
    shareUrl?: string;
  };
}

const pdfController = async (
  req: Request<object, object, PdfExportBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = auditResultSchema.safeParse(req.body.result);
    if (!parsed.success) {
      const err: ApiError = {
        name: 'ValidationError',
        message: 'Invalid audit result data',
        code: status.BAD_REQUEST,
      };
      next(err);
      return;
    }

    const meta: PdfMeta = {
      date: req.body.meta?.date ?? new Date().toISOString(),
      shareUrl: req.body.meta?.shareUrl,
    };

    const html = buildPdfHtml(parsed.data, meta);
    const pdfBuffer = await renderPdf(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="spendsmart-audit.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.status(status.OK).end(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

export default pdfController;
