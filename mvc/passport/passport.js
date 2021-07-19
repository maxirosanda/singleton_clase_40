
import mongoose from 'mongoose'
import User from '../models/usuarios.js'
import passport from 'passport'
import Local from 'passport-local'
import Facebook from 'passport-facebook'
import bcrypt from 'bcrypt'

const clientID = '481454786493399'
const clientSecret = 'e32d943fab84fe535f54112ee9169fa4'

mongoose.set('useCreateIndex', true)
const LocalStrategy = Local.Strategy
const FacebookStrategy = Facebook.Strategy

const isValidPassword = function (user, password) {
  return bcrypt.compareSync(password, user.password)
}
const createHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

export const ConectarPassport = () => {
  passport.use('login', new LocalStrategy({ passReqToCallback: true },
    function (req, username, password, done) {
      User.findOne({ username: username },
        function (err, user) {
          if (err) return done(err)
          if (!user) return done(null, false)
          if (!isValidPassword(user, password)) return done(null, false)
          return done(null, user)
        })
    })
  )

  passport.use('register', new LocalStrategy({ passReqToCallback: true },
    function (req, username, password, done) {
      const findOrCreateUser = function () {
        User.findOne({ username: username },
          function (err, user) {
            if (err) return done(err)
            if (user) {
              return done(null, false)
            } else {
              const newUser = new User()
              newUser.username = username
              newUser.password = createHash(password)
              newUser.mail = req.body.mail
              newUser.nombre = req.body.nombre
              newUser.direccion = req.body.direccion
              newUser.edad = req.body.edad
              newUser.preTel = req.body.pre_tel
              newUser.tel = req.body.tel
              newUser.foto = req.body.foto
              newUser.tipoUsuario = 'comprador'
              newUser.metodo = 'Local'
              newUser.save(function (err) {
                if (err) { throw err }
                return done(null, newUser)
              })
            }
          })
      }
      process.nextTick(findOrCreateUser)
    })
  )

  passport.use('facebook', new FacebookStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: '/facebook/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    const findOrCreateUser = function () {
      User.findOne({ username: profile.displayName },
        function (err, user) {
          if (err) return done(err)
          if (user) {
            return done(null, user)
          } else {
            const newUser = new User()
            newUser.username = profile.displayName
            newUser.password = createHash(profile.id)
            newUser.tipoUsuario = 'comprador'
            newUser.metodo = 'facebook'
            newUser.save(function (err) {
              if (err) { throw err }
              return done(null, newUser)
            })
          }
        })
    }
    process.nextTick(findOrCreateUser)
  }))

  passport.serializeUser(function (user, done) {
    done(null, user._id)
  })
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      if (err) {
        console.log(err.stack)
      }
      done(null, user)
    })
  })
}
