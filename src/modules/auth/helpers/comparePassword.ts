import bcrypt from 'bcrypt'

const comparePassword = async (password: string, passwordHash: string)=>{
    return await bcrypt.compare(password, passwordHash)
}

export default comparePassword