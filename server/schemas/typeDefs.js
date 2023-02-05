const typeDefs = `
    type Auth {
        token: String
        user: User
    }
    
    type Author {
        name: String
    }
    
    type Book {
        bookId: String!
        authors: [Author]
        description: String!
        image: String
        link: String
        title: String!
    }

    input BookInput {
        authors: [String]
        description: String!
        title: String!
        bookId: String!
        image: String
        link: String
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Query {
        users: [User]
        me(_id: ID, username: String): User
    }

    type Mutation {
        login(email: String, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(_id: ID!, input: BookInput): User
        removeBook(_id: ID!, bookId: String!): User
    }
`

module.exports = typeDefs