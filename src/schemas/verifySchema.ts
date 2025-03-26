import {z} from 'zod';

export const verifySchema=z.object({
    code:z.string().length(5,"verification  Code must be 5 character long")
})