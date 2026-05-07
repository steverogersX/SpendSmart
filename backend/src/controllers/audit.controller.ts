import { ApiError } from '@/types';
import { auditRequestSchema } from '@/types/schemas';
import { Request, Response } from 'express';
import status from 'http-status';
import { fromZodError } from 'zod-validation-error';

const auditController = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedAudit = auditRequestSchema.safeParse(req.body);
        if (!parsedAudit.success) {
            const errorMessage = fromZodError(parsedAudit.error);
            throw new ApiError(errorMessage.message, status.BAD_REQUEST);
        }
    }
    catch (err: unknown) {
        throw err;
    }
}


export default auditController;