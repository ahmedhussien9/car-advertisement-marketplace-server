const express = require('express');
const router = express.Router();
const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const passwordResetToken = require('../models/resetAdminToken.model');
const { ErrorHandler } = require("../helper/validationError");

global.crypto = require('crypto')

router.post('/signup', async (req, res, next) => {
    console.log('entered')
    const userEmail = await Admin.findOne({
        email: req.body.email
    });
    if (userEmail) {
        return res
            .status(409)
            .json({ message: 'Email already exist' });
    }

    const userName = await Admin.findOne({
        username: req.body.username
    });
    if (userName) {
        return res
            .status(409)
            .json({ message: 'Username already exist' });
    }

    return bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res
                .status(400)
                .json({ message: 'Error hashing password' });
        }
        const body = {
            username: req.body.username,
            email: req.body.email,
            password: hash
        };
        Admin.create(body)
            .then(user => {
                res.status(201).json({ message: 'User created successfully', user });
            })
            .catch((err) => {
                console.log(err)
                res.status(500)
                    .json({ message: 'Error occured' });
            });
    });
});



router.post('/login', async (req, res, next) => {
    let fetchedUser;
    Admin.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'Auth Failed'
            })
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password)
    })
        .then(result => {
            console.log(result);
            if (!result) {
                return res.status(401).json({
                    message: 'Auth Failed!',
                    error: err
                })
            }
            const token = jwt.sign({
                name: fetchedUser.name,
                userId: fetchedUser._id
            },
                "secret_this_should_be_longer", {
            })
            res.status(200).json({
                userId: fetchedUser._id,
                name: fetchedUser.username,
                email: fetchedUser.email,
                token: token,
            });
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({
                message: 'Auth Failed!',
                error: err
            })
        })
})


router.post('/validate-token', async (req, res, next) => {
    try {
        if (!req.body.resettoken) {
            return res
                .status(500)
                .json({ message: 'Token is required' });
        }
        const user = await passwordResetToken.findOne({
            resettoken: req.body.resettoken
        });
        if (!user) {
            return res
                .status(409)
                .json({ message: 'Invalid URL, Please try to request new email' });
        }
        Admin.findOneAndUpdate({ _id: user._userId }).then(() => {
            res.status(200).json({ message: 'Token verified successfully.' });
        }).catch((err) => {
            return res.status(500).send({ msg: err.message });
        });
    } catch (err) {
        next(err);
    }
});

router.post('/change-password', async (req, res, next) => {
    try {
        console.log(req.body)
        const userToken = await passwordResetToken.findOne({ resettoken: req.body.resettoken });

        if (!userToken) {
            console.log(userToken)
            throw new ErrorHandler(409, 'Token has expired, Please request new email!');
        }

        const userEmail = await Admin.findOneAndUpdate({ _id: userToken._userId });

        if (!userEmail) {
            throw new ErrorHandler(409, 'User does not exist');
        }

        return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
            if (err) {
                throw new ErrorHandler(400, 'Error hashing password');
            }
            userEmail.password = hash;
            userEmail.save(function (err) {
                if (err) {
                    throw new ErrorHandler(400, 'Password can not reset.');

                } else {
                    userToken.remove();
                    return res.json({
                        message: 'Password reset successfully',
                        status: 201
                    });
                }
            });
        });
    } catch (err) {
        next(err);
    }
});

// Reset Password Email Template
router.post('/reset-password', async (req, res, next) => {

    if (!req.body.email) {
        return res
            .status(500)
            .json({ message: 'Email is required' });
    }
    const user = await Admin.findOne({
        email: req.body.email
    });
    if (!user) {
        return res
            .status(409)
            .json({ message: 'Email does not exist' });
    }
    var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
    resettoken.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        passwordResetToken.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
        res.status(200).json({ message: 'Reset Password successfully, Please check your Email.' });
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            port: 25, // port for secure SMTP
            secure: false, // use SSL 
            auth: {
                user: 'ahmedbakrfs@gmail.com',
                pass: 'ahmed30331333'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        var mailOptions = {
            to: user.email,
            from: 'ahmedbakrfs@gmail.com',
            subject: `Eve ${user.username} Password Reset`,
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'https://evestore.herokuapp.com/auth/reset-password?token=' + resettoken.resettoken + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        })
    })
})



module.exports = router;
