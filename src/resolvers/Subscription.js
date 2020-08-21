import getUserId from '../utils/getUserId'

const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0

            setInterval(() => {
                count++
                pubsub.publish('count', {
                    count
                })
            }, 1000)

            return pubsub.asyncIterator('count')
        }
    },
    user: {
        subscribe(parent, args, { request, prisma }, info) {
            const userId = getUserId(request)

            return prisma.subscription.user({
                       user: userId
            }, info)
        }
    },
}

export { Subscription as default }