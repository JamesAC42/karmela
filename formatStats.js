function formatStats(data, userid, showGiven) {
    if(!data[userid]) {
        return "";
    }
    let userData = data[userid];
    let statString = "";
    statString += "__Stats for " + userData.username + ":__\n";
    statString += "Score: **" + (userData.totalUpvotesReceived - userData.totalDownvotesReceived) + "**\n";
    statString += "| Total Upvotes Received: **" + userData.totalUpvotesReceived + "**\n";
    statString += "| Total Downvotes Received: **" + userData.totalDownvotesReceived + "**\n";
    statString += "| Total Chuds Received: **" + userData.totalChudsReceived + "**\n";
    
    if(showGiven) {
        statString += "| Total Upvotes Given: **" + userData.totalUpvotesGiven + "**\n";
        statString += "| Total Downvotes Given: **" + userData.totalDownvotesGiven + "**\n";  
        statString += "| Total Chuds Given: **" + userData.totalChudsGiven + "**\n";  
    }
    return statString;
}

module.exports = {
    formatStats
}