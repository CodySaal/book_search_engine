const { AuthenticationError } = require("apollo-server-express")
const { User } = require("../models")
const { signToken } = require("../utils/auth")

const resolvers = {
    Query: {
        me: async (parent, args, context, info) => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id }).populate("savedBooks")
            }
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
            const auth = { token, user }
            return auth
        },

        addUser: async (parent, args, context, info) => {
            const user = await User.create(args)
            const token = signToken(user)
            const auth = { token, user }
            return auth
        },

        saveBook: async (parent, { input }, context, info) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: { savedBooks: input}},
                    { new: true }
                )
                return updatedUser
            }
        },

        removeBook: async (parent, { bookId }, context, info)  => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    { $pull: {savedBooks: bookId}},
                    { new: true }
                )
                    return updatedUser
            }
        }
    }
}

module.exports = resolvers