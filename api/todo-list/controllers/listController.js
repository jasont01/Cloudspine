const List = require('../models/listModel.js')
const Item = require('../models/itemModel.js')

/**
 * @desc Get all lists owned by user
 * @route GET /api/todo-list/lists
 * @access Private
 */
const getLists = async (req, res) => {
  const lists = await List.find({ user: req.userId }).select('-__v')

  res.status(200).json(lists)
}

/**
 * @desc Crate a new list
 * @route POST /api/todo-list/lists
 * @access Private
 */

const createList = async (req, res) => {
  const title = req.body.title ? req.body.title : 'Untitled List'

  const newList = await List.create({
    user: req.userId,
    title,
  })

  res.status(201).json(newList)
}

/**
 * @desc Update a list
 * @route PUT /api/todo-list/lists/:id
 * @access Private
 */
const updateList = async (req, res) => {
  const list = await List.findById(req.params.id)

  if (!list) {
    res.status(400)
    throw new Error('List not found')
  }

  if (list.user.toString() !== req.userId) {
    res.status(401)
    throw new Error('Not authorized')
  }

  const title = req.body.title ? req.body.title : list.title

  const updatedList = await List.findByIdAndUpdate(
    req.params.id,
    {
      title,
    },
    {
      new: true,
    }
  )

  res.status(200).json(updatedList)
}

/**
 * @desc Delete a list
 * @route DELETE /api/todo-list/lists/:id
 * @access Private
 */
const deleteList = async (req, res) => {
  const list = await List.findById(req.params.id)

  if (!list) {
    res.status(400)
    throw new Error('List not found')
  }

  if (list.user.toString() !== req.userId) {
    res.status(401)
    throw new Error('Not authorized')
  }

  await Item.deleteMany({ listId: req.params.id, user: req.userId })
  await list.remove()

  res.status(200).json({ _id: req.params.id })
}

module.exports = { getLists, createList, updateList, deleteList }
