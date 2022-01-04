const User = require('../models/User')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const token = await jwt.sign({ name: req.body.name, email: req.body.email, password: req.body.password }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })

    //sending email from nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SERVER_EMAIL,
            pass: process.env.SERVER_PASS
        }
    });

    const mailOptions = {
        from: 'saicharana01@gmail.com',
        to: req.body.email,
        subject: 'Activate your account',
        html: `<h2>Welcome to the family</h2> <a href="https://<yourSuperDomain>/confirmation/${token}"}>activate account</a>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Please confirm your email' })
}

const activate = async (req, res) => {
    const { clientToken } = req.params
    let payload;
    try {
        payload = jwt.verify(clientToken, process.env.JWT_SECRET)
    } catch (err) {
        throw new UnauthenticatedError(`Not authorized`)
    }

    const user = await User.create({ ...payload })
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, clientToken })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError(`Please provide email and password`)
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError(`Invalid credentials`)
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError(`Invalid credentials`)
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
    register,
    login,
    activate
}