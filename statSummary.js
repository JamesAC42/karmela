const fs = require('fs');

function statSummary(stat) {
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    let users = Object.keys(data);
    let upvotesReceived = [];
    let upvotesGiven = [];
    let downvotesReceived = [];
    let downvotesGiven = [];
    let chudsReceived = [];
    let chudsGiven = [];
    let chudRatio = [];
    let upvoteRatio = [];
    let downvoteRatio = [];
    let active = [];
    let reacted = [];

    if(users.length === 0) {
        return "There are no stats to report on!";
    }

    for(let user of users) {
        if(user === "1065842890426814576") {
            continue;
        }
        let username = data[user].username;
        
        let upvotesReceivedItem;
        let upvotesGivenItem;
        let downvotesReceivedItem;
        let downvotesGivenItem;
        let chudsReceivedItem;
        let chudsGivenItem;
        if(stat === "thisWeek" || stat === "thisMonth" || stat === "thisYear") {
            upvotesReceivedItem = data[user][stat].upvotesReceived;
            upvotesGivenItem = data[user][stat].upvotesGiven;
            downvotesReceivedItem = data[user][stat].downvotesReceived;
            downvotesGivenItem = data[user][stat].downvotesGiven;
            chudsReceivedItem = data[user][stat].chudsReceived;
            chudsGivenItem = data[user][stat].chudsGiven;
        } else {
            upvotesReceivedItem = data[user].totalUpvotesReceived;
            upvotesGivenItem = data[user].totalUpvotesGiven
            downvotesReceivedItem = data[user].totalDownvotesReceived;
            downvotesGivenItem = data[user].totalDownvotesGiven;
            chudsReceivedItem = data[user].totalChudsReceived;
            chudsGivenItem = data[user].totalChudsGiven;
        }

        upvotesReceived.push({username,upvotes:upvotesReceivedItem});
        upvotesGiven.push({username,upvotes:upvotesGivenItem});
        downvotesReceived.push({username,downvotes:downvotesReceivedItem});
        downvotesGiven.push({username,downvotes:downvotesGivenItem});
        chudsReceived.push({username,chuds:chudsReceivedItem});
        chudsGiven.push({username,chuds:chudsGivenItem});

        let upvoteRatioItem = 1;
        if(upvotesGivenItem === 0) {
            upvoteRatioItem = upvotesReceivedItem;
        } else {
            upvoteRatioItem = upvotesReceivedItem / upvotesGivenItem;
        }
        upvoteRatioItem = Math.round(upvoteRatioItem * 100) / 100;
        upvoteRatio.push({username,ratio:upvoteRatioItem});

        let downvoteRatioItem = 1;
        if(downvotesReceivedItem === 0) {
            downvoteRatioItem = downvotesGivenItem;
        } else {
            downvoteRatioItem = downvotesGivenItem / downvotesReceivedItem;
        }
        downvoteRatioItem = Math.round(downvoteRatioItem * 100) / 100;
        downvoteRatio.push({username,ratio:downvoteRatioItem});

        let chudRatioItem = 1;
        if(chudsReceivedItem === 0) {
            chudRatioItem = chudsReceivedItem;
        } else {
            chudRatioItem = chudsReceivedItem / chudsGivenItem;
        }
        chudRatioItem = Math.round(chudRatioItem * 100) / 100;
        chudRatio.push({username,ratio:chudRatioItem});

        let activeCount = upvotesGivenItem + downvotesGivenItem + chudsGivenItem;
        active.push({username,activeCount});

        let reactedCount = upvotesReceivedItem + downvotesReceivedItem + chudsReceivedItem;
        reacted.push({username,reactedCount})

    }

    upvotesReceived.sort((a,b) => {return a.upvotes - b.upvotes});
    upvotesGiven.sort((a,b) => {return a.upvotes - b.upvotes});
    downvotesReceived.sort((a,b) => {return a.downvotes - b.downvotes});
    downvotesGiven.sort((a,b) => {return a.downvotes - b.downvotes});
    chudsReceived.sort((a,b) => {return a.chuds - b.chuds});
    chudsGiven.sort((a,b) => {return a.chuds - b.chuds});
    chudRatio.sort((a,b) => {return a.ratio - b.ratio});
    upvoteRatio.sort((a,b) => {return a.ratio - b.ratio});
    downvoteRatio.sort((a,b) => {return a.ratio - b.ratio});
    active.sort((a,b) => {return a.activeCount - b.activeCount});
    reacted.sort((a,b) => {return a.reactedCount - b.reactedCount});

    let userAmount = users.length;
    let resultString = "";
    let timeDesc;
    resultString += "__Here's the score report"
    if(stat === "thisWeek" || stat === "thisMonth" || stat === "thisYear") {
        timeDesc = stat.substring(4).toLowerCase();
        resultString += " for the " + timeDesc + ":__\n";
    } else {
        resultString += " over all time:__\n";
    }
    resultString += "----------------------------------\n";
    resultString += "<:up:945761867043864586>\n";
    resultString += "\tMost upvotes received: **" + upvotesReceived[userAmount - 1].username + " (" + upvotesReceived[userAmount - 1].upvotes + " upvotes)**\n";
    resultString += "\tLeast upvotes received: **" + upvotesReceived[0].username + " (" + upvotesReceived[0].upvotes + " upvotes)**\n";
    resultString += "\tMost upvotes given: **" + upvotesGiven[userAmount - 1].username + " (" + upvotesGiven[userAmount - 1].upvotes + " upvotes)**\n";
    resultString += "\tLeast upvotes given: **" + upvotesGiven[0].username + " (" + upvotesGiven[0].upvotes + " upvotes)**\n";
    resultString += "\tHighest upvote ratio (received/given): **" + upvoteRatio[userAmount - 1].username + " (" + upvoteRatio[userAmount - 1].ratio + ")**\n";
    resultString += "\tLowest upvote ratio (received/given): **" + upvoteRatio[0].username + " (" + upvoteRatio[0].ratio + ")**\n";
    resultString += "----------------------------------\n";
    resultString += "<:down:945761788002193499>\n";
    resultString += "\tMost downvotes received: **" + downvotesReceived[userAmount - 1].username + " (" + downvotesReceived[userAmount - 1].downvotes + " downvotes)**\n";
    resultString += "\tLeast downvotes received: **" + downvotesReceived[0].username + " (" + downvotesReceived[0].downvotes + " downvotes)**\n";
    resultString += "\tMost downvotes given: **" + downvotesGiven[userAmount - 1].username + " (" + downvotesGiven[userAmount - 1].downvotes + " downvotes)**\n";
    resultString += "\tLeast downvotes given: **" + downvotesGiven[0].username + " (" + downvotesGiven[0].downvotes + " downvotes)**\n";
    resultString += "\tHighest downvote ratio (received/given): **" + downvoteRatio[userAmount - 1].username + " (" + downvoteRatio[userAmount - 1].ratio + ")**\n";
    resultString += "\tLowest downvote ratio (received/given): **" + downvoteRatio[0].username + " (" + downvoteRatio[0].ratio + ")**\n";
    resultString += "----------------------------------\n";
    resultString += "<:chud:1025401867494236221>\n";
    resultString += "\tMost chuds received: **" + chudsReceived[userAmount - 1].username + " (" + chudsReceived[userAmount - 1].chuds + " chuds)**\n";
    resultString += "\tLeast chuds received: **" + chudsReceived[0].username + " (" + chudsReceived[0].chuds + " chuds)**\n";
    resultString += "\tMost chuds given: **" + chudsGiven[userAmount - 1].username + " (" + chudsGiven[userAmount - 1].chuds + " chuds)**\n";
    resultString += "\tLeast chuds given: **" + chudsGiven[0].username + " (" + chudsGiven[0].chuds + " chuds)**\n";
    resultString += "\tHighest chud ratio (received/given): **" + chudRatio[userAmount - 1].username + " (" + chudRatio[userAmount - 1].ratio + ")**\n";
    resultString += "\tLowest chud ratio (received/given): **" + chudRatio[0].username + " (" + chudRatio[0].ratio + ")**\n";
    resultString += "----------------------------------\n";
    resultString += "<:enisangryface:1044817513738940537>\n"
    resultString += "\tMost reactions given: **" + active[userAmount - 1].username + " (" + active[userAmount - 1].activeCount + " reactions)**\n";
    resultString += "\tLeast reactions given: **" + active[0].username + " (" + active[0].activeCount + " reactions)**\n";
    resultString += "\tMost reactions received: **" + reacted[userAmount - 1].username + " (" + reacted[userAmount - 1].reactedCount + " reactions)**\n";
    resultString += "\tLeast reactions received: **" + reacted[0].username + " (" + reacted[0].reactedCount + " reactions)**\n";
    resultString += "----------------------------------";

    return resultString;

}

module.exports = {
    statSummary
}