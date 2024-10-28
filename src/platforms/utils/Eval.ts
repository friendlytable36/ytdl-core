import { Jinter } from '@/dependence/Jinter';

export function evaluate(code: string): any {
    const JINTER = new Jinter();
    return JINTER.evaluate(code);
}
