import auditService from '../services/audit.service';
import { AuditResult } from '../types';
import { AnyToolInput } from '@shared/schemas/audit';
import apiCases from './data/api_test_cases.json';
import subCases from './data/subscription_test_cases.json';

type TestCase = {
    description: string;
    input: AnyToolInput;
    expectedOutput: AuditResult['results'][number];
};

describe('auditService — API audit', () => {
    for (const tc of apiCases as TestCase[]) {
        describe(tc.description, () => {
            it('produces the expected audit result', () => {
                const result = auditService({ tools: [tc.input] });
                expect(result.results).toEqual([tc.expectedOutput]);
            });
        });
    }
});

describe('auditService — Subscription audit', () => {
    for (const tc of subCases as TestCase[]) {
        describe(tc.description, () => {
            it('produces the expected audit result', () => {
                const result = auditService({ tools: [tc.input] });
                expect(result.results).toEqual([tc.expectedOutput]);
            });
        });
    }
});
