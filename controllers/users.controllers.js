const User = require('../models/user');
const bcrypt = require('bcrypt')
const { default: code } = require('http-status');

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