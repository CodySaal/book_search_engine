const { AuthenticationError } = require("apollo-server-express")
const { User } = require("../models")
const { signToken } = require("../utils/auth")

const resolvers = {
    Query: {
        me: async (parent, args, context, info) => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id }).populate("savedBooks")
            }
            throw new AuthenticationError("Must be logged in.")
        }
    },
    Mutation: {
        login: async (parent, { email, password }, context, info) => {
            const user = await User.findOne({ email })
            if (!user) {
                throw new AuthenticationError("User not found.")
            }
            const correctPassword = await user.isCorrectPassword(password)
            if (!correctPassword) {
                throw new AuthenticationError("Incorrect password.")
            }
            const token = signToken(user)
            return { token, user }
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password })
            const token = signToken(user)
            return { token, user }
        },

        saveBook: async (parent, { input }, context, info) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: { savedBooks: input}},
                    { new: true }
                )
                return updatedUser
            }
        },

        removeBook: async (parent, { bookId }, context, info)  => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: {savedBooks: {bookId}}},
                    { new: true }
                )
                    return updatedUser
            }
        }
    }
}

module.exports = resolvers