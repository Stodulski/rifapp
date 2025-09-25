export type UserType = {
    name: string,
    lastname: string,
    birthdate: Date | string,
    phone: string,
    email: string,
    password: string
}

export type UserLoginType = {
    email: string,
    password: string
}