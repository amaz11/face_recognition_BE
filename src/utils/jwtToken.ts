import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from './secret'
export const tokenGenerator = (user: any) => {
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY!, {
        expiresIn: '24h'
    })
    return token
}