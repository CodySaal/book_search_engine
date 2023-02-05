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
            const correctPassword = await user.isCorrectPassword(password)
            let token
            if (correctPassword) {
                token = signToken(user)
            } else {
                return
            }
            const auth= { token, user }
            return auth
        },

        addUser: async (parent, args, context, info) => {
            return await User.create(args)
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