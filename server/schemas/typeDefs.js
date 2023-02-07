const typeDefs = `
    type Auth {
        token: ID
        user: User
    }
    
    
    type Book {
        bookId: String!
        authors: [String]
        description: String!
        image: String
        link: String
        title: String!
    }

    input BookInput {
        authors: [String]
        description: String!
        title: String!
        bookId: ID!
        image: String
        link: String
    }

    type User {
        _id: ID!
        username: String!
        password: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Query {
        me(_id: ID, username: String): User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(_id: ID!, input: BookInput): User
        removeBook(_id: ID!, bookId: ID!): User
    }
`

module.exports = typeDefs