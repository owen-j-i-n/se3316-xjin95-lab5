const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')

const config = require('../config')

const opts = {
    // Prepare the extractor from the header.
    jwtFromRequest: ExtractJwt.fromExtractors([
        req => req.body['authorization'] || req.query['authorization'] || req.query["token"] || req.body['token'],
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    ]),
    secretOrKey: config.JWT_SECRET,
    issuer: config.JWT_ISSUER,
    audience: config.JWT_AUDIENCE,
    algorithms: [config.JWT_ALG],
    passReqToCallback: true
}

module.exports = passport => {
    
    passport.use(new JwtStrategy(opts, async function (req, jwt_payload, done) {

        try {
            
            const userInfo = await User.findOne({
                _id: jwt_payload._id
            })
            if (userInfo && userInfo.state=="active") {
                done(null, userInfo)
            } else {
                done(null, false)
            }
        } catch (e) {
            return done(e)
        }
    }))
    

}