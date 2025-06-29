import jwt from 'jsonwebtoken'

// Generate a short-lived access token (5s for demo; ~15min for real apps)
export const generateAccessToken = (user : any) => {
    const access_token = jwt.sign( {id: user.id}, process.env.ACCESS_TOKEN!, {expiresIn: '5s'})   
    return access_token
}

export const generateRefreshToken = (user:any) => {
    const refresh_token = jwt.sign({id: user.id}, process.env.REFRESH_TOKEN!, {expiresIn: '7d'})
    return refresh_token
}
