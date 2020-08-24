import getUserId from '../utils/getUserId'

const User = {
    books: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { prisma }, info) {
            return prisma.query.books({
                where: {
                    reviwer: {
                        id: parent.id
                    }
                }
            })

        }
    },
    email: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { request }, info) {
            const userId = getUserId(request, false)
    
            if (userId && userId === parent.id) {
                return parent.email
            } else {
                return null
            }
        }
    }
}

export { User as default }
