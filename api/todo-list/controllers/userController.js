const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel.js')
const List = require('../models/listModel.js')
const Item = require('../models/itemModel.js')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

/**
 * @desc   Register user
 * @route  POST /api/todo-list/user/register
 * @access Public
 */
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password) {
    res.status(400)
    throw new Error('All fields are required')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  })

  if (!user) {
    res.status(400)
    throw new Error('Error registering user')
  }

  await List.create({
    user: user._id,
    title: 'Default List',
  })

  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    token: generateToken(user._id),
  })
}

/**
 * @desc   Login user
 * @route  POST /api/todo-list/user/login
 * @access Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      remember: req.body.remember,
      token: generateToken(user.id),
    })
  } else {
    res.status(400).json({
      message: 'Invalid credentials',
    })
  }
}

/**
 * @desc   Get user
 * @route  GET /api/todo-list/user
 * @access Private
 */
const getUser = async (req, res) => {
  try {
    req.user = await User.findById(req.userId).select('-password')
    res.status(200).json(req.user)
  } catch (err) {
    res.status(401)
    throw new Error('Not authorized')
  }
}

/**
 * @desc   Delete user
 * @route  DELETE /api/todo-list/user
 * @access Private
 */
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(400)
    throw new Error('User not found')
  }

  if (user._id.toString() !== req.userId) {
    res.status(401)
    throw new Error('Not authorized')
  }

  await Item.deleteMany({ user: req.userId })
  await List.deleteMany({ user: req.userId })
  await User.findByIdAndDelete(req.userId)

  res.status(204).end()
}

module.exports = { registerUser, loginUser, getUser, deleteUser }
