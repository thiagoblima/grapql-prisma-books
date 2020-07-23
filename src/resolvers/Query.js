import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after
        }
        
        if (args.query) {
           opArgs.where = {
              OR:[{
                  name_contains: args.query
              },
              {
                  email_contains: args.query
              }]
           }
        }

        return prisma.query.users(opArgs, info)
     
    },
    greeting(parent, args, ctx, info) {
        if (args.name && args.position) {
            return `Hello, ${args.name}! You are my favoriate ${args.position}.`
        } else {
            return 'Hello!'
        }
    },
    order(parent, args, ctx, info) {
        if (args.item && args.qtd && args.price) {
            return `Your order: ${args.qtd} - ${args.item} - ${args.price}`
        }
    },
    add(parent, args, ctx, info) {
        if (args.numbers.length === 0) {
            return 0
        }

        return args.numbers.reduce((accumulator, currentValue) => {
            return accumulator + currentValue
        })
    },
    grades(parent, args, ctx, info) {
        return [99, 80, 93]
    },
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.query.user({
            where: {
                id: userId
            }
        })
    },
}

export { Query as default }
