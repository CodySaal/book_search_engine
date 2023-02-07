const { AuthenticationError } = require("apollo-server-express")
const { User } = require("../models")
const { signToken } = require("../utils/auth")

const resolvers = {
    Query: {
        me: async (parent, { _id, username }, context, info) => {
            if (username) {
                return await User.findOne({ username })
            }
            return await User.findById(_id)
        }
    },
    Mutation: {
        login: async (parent, { email, password }, context, info) => {
            const user = await User.findOne({ email })
            if (!user) {
                throw new AuthenticationError("No user found.")
            }
            const correctPassword = await user.iscorrectPassword(password)
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

        saveBook: async (parent, { _id, input }, context, info) => {
            return await User.findOneAndUpdate(
                {_id},
                {$addToSet: { savedBooks: input}},
                { new: true }
            )
        },

        removeBook: async (parent, { _id, bookId }, context, info)  => {
            return await User.findOneAndUpdate(
                {_id},
                { $pull: {savedBooks: bookId}},
                { new: true }
            )
        }
    }

}

module.exports = resolvers