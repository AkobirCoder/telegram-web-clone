import * as z from "zod";
 
export const emailSchema = z.object({
    email: z.string().email({message: 'Invalid email address, please check try and again.'}),
});

export const otpSchema = z.object({
    otp: z.string().min(6, {
        message: 'Your one-time password must be 6 characters.',
    }),
}).merge(emailSchema);

export const messageSchema = z.object({
    text: z.string().min(1, {message: 'Message cannot be empty.'}),
    image: z.string().optional(),
});

export const profileSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().optional(),
    bio: z.string().optional(),
});