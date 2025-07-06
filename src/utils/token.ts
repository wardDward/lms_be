import jwt from 'jsonwebtoken'

// Generate a short-lived access token (5s for demo; ~15min for real apps)
export const generateAccessToken = (user : any) => {
    const access_token = jwt.sign( user, process.env.ACCESS_TOKEN!, {expiresIn: '15m'})   
    return access_token
}

export const generateRefreshToken = (user:any) => {
    const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN!, {expiresIn: '7d'})
    return refresh_token
}
