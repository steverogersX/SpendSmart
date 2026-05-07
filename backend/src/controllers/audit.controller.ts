import { ApiError, ApiResponse } from '@/types';
import { auditRequestSchema } from '@/types/schemas';
import { Request, Response, NextFunction } from 'express';
import status from 'http-status';
import { fromZodError } from 'zod-validation-error';

const auditController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const parsedAudit = auditRequestSchema.safeParse(req.body);
        if (!parsedAudit.success) {
            const errorMessage = fromZodError(parsedAudit.error);
            throw new ApiError(errorMessage.message, status.BAD_REQUEST);
        }

        const response: ApiResponse = {
            success: true,
            data: { message: 'Audit data received successfully' },
        };
        res.status(status.OK).json(response);
    }
    catch (err: unknown) {
        next(err);
    }
}


export default auditController;