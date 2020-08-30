import { extractFragmentReplacements } from 'prisma-binding'
import Query from './Query'
import Mutation from './Mutation'
import Subscription from './Subscription'
import User from './User'
import Book from './Book'

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Book
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }
