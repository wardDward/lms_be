import jwt from 'jsonwebtoken'

// Generate a short-lived access token (5s for demo; ~15min for real apps)
export const generateAccessToken = (user_id: number) => {
    const access_token = jwt.sign({ sub: user_id }, process.env.ACCESS_TOKEN!, { expiresIn: '1d' })
    return access_token
}

export const generateRefreshToken = (user_id: number) => {
    const refresh_token = jwt.sign({ sub: user_id }, process.env.REFRESH_TOKEN!, { expiresIn: '7d' })
    return refresh_token
}
