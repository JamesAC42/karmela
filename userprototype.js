const userPrototype = {
    username: "",
    totalUpvotesReceived: 0,
    totalDownvotesReceived: 0,
    totalUpvotesGiven: 0,
    totalDownvotesGiven: 0,
    totalChudsGiven: 0,
    totalChudsReceived: 0,
    thisWeek: {
        upvotesReceived: 0,
        downvotesReceived: 0,
        upvotesGiven: 0,
        downvotesGiven: 0,
        chudsGiven: 0,
        chudsReceived: 0,
    },
    thisMonth: {
        upvotesReceived: 0,
        downvotesReceived: 0,
        upvotesGiven: 0,
        downvotesGiven: 0,
        chudsGiven: 0,
        chudsReceived: 0,
    },
    thisYear: {
        upvotesReceived: 0,
        downvotesReceived: 0,
        upvotesGiven: 0,
        downvotesGiven: 0,
        chudsGiven: 0,
        chudsReceived: 0,
    }
};

module.exports = {
    userPrototype,
    createUser: () => {
        return JSON.parse(JSON.stringify(userPrototype));
    }
}