const moment = require('moment');

function getTestUsers() {
    return [
        {id: 1, first_name: 'Ada', last_name: 'Lovelace', email: 'aaa@gmail.com', password: 'aaa', ranking: "Mood Ninja"},
        {id: 2, first_name: 'Bobbi', last_name: 'Brown', email: 'bbb@gmail.com', password: 'bbb', ranking: "Mood Ninja"},
        {id: 3, first_name: 'Cara', last_name: 'Comm', email: 'ccc@gmail.com', password: 'ccc', ranking: "Mood Ninja"},
    ]
};

function getTestMoodLogs(){
    return [
        {id: 1, user_id: 1, mood: 'happy', start_date: moment("06-01-2020", 'MM-DD-YYYY'), end_date: moment("06-01-2020", 'MM-DD-YYYY'), title: "\xA0", activities: ['sun', 'bath'], sleepHours: 8, notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elit.'},
        {id: 2, user_id: 1, mood: 'sad', start_date: moment("06-05-2020", 'MM-DD-YYYY'), end_date: moment("06-05-2020", 'MM-DD-YYYY'), title: "\xA0", activities: ['outdoors', 'family'], sleepHours: 6, notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elit.'},
        {id: 3, user_id: 1, mood: 'calm', start_date: moment("06-10-2020", 'MM-DD-YYYY'), end_date: moment("06-10-2020", 'MM-DD-YYYY'), title: "\xA0", activities: ['family', 'friends'], sleepHours: 4, notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elit.'},
    ]
};

module.exports = {
    getTestUsers,
    getTestMoodLogs
};