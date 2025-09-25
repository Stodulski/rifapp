import z from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty({ message: 'Name is required' })
      .min(1, { message: 'Name must be at least 1 character' })
      .max(40, { message: 'Name cannot exceed 40 characters' }),

    lastname: z
      .string()
      .nonempty({ message: 'Last name is required' })
      .min(1, { message: 'Last name must be at least 1 character' })
      .max(40, { message: 'Last name cannot exceed 40 characters' }),

    birthdate: z
      .string()
      .nonempty({ message: 'Birthdate is required' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Birthdate must be in YYYY-MM-DD format'
      }),

    phone: z.string().nonempty({ message: 'Phone number is required' }),

    email: z
      .email({ message: 'Invalid email address' })
      .nonempty({ message: 'Email is required' }),

    password: z
      .string()
      .nonempty({ message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' }),

    confirmPassword: z
      .string()
      .nonempty({ message: 'Please confirm your password' })
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match.'
      })
    }
  })
  .transform(({ confirmPassword, ...rest }) => rest)


export const loginSchema = z.object({
  email: z.email().nonempty("Email is required."),
  password: z.string().nonempty("Password is required.")
})

