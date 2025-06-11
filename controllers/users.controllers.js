const User = require('../models/user');
const bcrypt = require('bcrypt')
const { default: code } = require('http-status');
const webToken = require('jsonwebtoken');

exports.signUp = (req, res) => {
    const ROUNDS = 10
    bcrypt.hash(req.body.password, ROUNDS)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(code.OK).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(code.BAD_REQUEST).json({ error }));
        })
        .catch(error => res.status(code.INTERNAL_SERVER_ERROR).json({ error }));
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.status(code.UNAUTHORIZED).json({ message: 'identifiant/mot de passe incorrect' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(code.UNAUTHORIZED).json({ message: 'identifiant/mot de passe incorrect' });
                        } else {
                            res.status(code.OK).json({
                                userId: user._id,
                                token: webToken.sign(
                                    { userId: user._id },
                                    process.env.TOKEN_KEY,
                                    { expiresIn: '6h' }
                                )
                            });
                        }
                    })
                    .catch(error => res.status(code.INTERNAL_SERVER_ERROR).json({ error }));
            }
        })
        .catch(error => res.status(code.INTERNAL_SERVER_ERROR).json({ error }));
}