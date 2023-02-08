const fs = require('fs');

function resetStat(stat) {
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    const users = Object.keys(data);
    for(let user of users) {
        let item = data[user][stat];
        let keys = Object.keys(item);
        for(let key of keys) {
            data[user][stat][key] = 0;
        }
    }
	fs.writeFileSync("./data.json", JSON.stringify(data, null, '    '));
}

module.exports = {
    resetStat
}