import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hasPassword from '../utils/hashPassword'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const password = await hasPassword(args.data.password)
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })
        
        return {
            user,
            token: generateToken(user.id)
        }
    },
    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async deleteUser(parent, args, { prisma, request }, info) {
        const userExists = await prisma.exists.User({ id: args.id })
        const userId = getUserId(request)

        if (!userExists) {
            throw new Error('User doesn\'t exist')
        }

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)

    },
    async updateUser(parent, args, { prisma, request }, info) {
        const userExists = await prisma.exists.User({ id: args.id })
        const userId = getUserId(request)


        if (typeof args.data.password === 'string') {
            args.data.password = await hasPassword(args.data.password)
        }

        if (!userExists) {
            throw new Error('User not found')
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId,
            },
            data: args.data
        }, info)
    },
    async createBook(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.createBook({
            data: {
                name: args.data.name,
                isbn: args.data.isbn,
                published: args.data.published,
                likes: 0,
                rating: 0,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)
    },
    async deleteBook(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const bookExists = await prisma.exists.Book({
           id: args.id,
           author: {
               id: userId
           }
        })
 
        if (!bookExists) {
            throw new Error('Unable to delete book')
        }
 
        return prisma.mutation.deleteBook({
           where: {
               id: args.id
           }
        })
 
     },
     async updateBook(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const bookExists = await prisma.exists.Book({
            id: args.id,
            author: {
                id: userId
            } 
        })

        const isPublished = await prisma.exists.Book({ id: args.id, published: true })

        if (!bookExists) {
            throw new Error('Unable to update book')
        }

        if (isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyReviews({
                where: {
                    book: {
                        id: args.id
                    }
                }
            })
        }

        return prisma.mutation.updateBook({
            where: {
                id : args.id
            },
            data: args.data
        }, info)
    },
}

export { Mutation as default }
