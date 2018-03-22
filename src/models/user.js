const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    breeds: {
        type: [String]
    },
    stressors: {
        type: [String]
    }
}, {
    collection: 'users'
});

mongoose.connect('mongodb://nullbrainsTeam:welovedogs123@ds221609.mlab.com:21609/de-stress-lab-db', (error) => {
    if (error) console.log(error);

    console.log('Database connection successful.');
});

module.exports = mongoose.model('User', userSchema);