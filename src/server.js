const app = require('./app');
const PORT = process.env.PORT || 3000;
const {db} = require('./database/config');
const repairModel = require('./models/repair.model');
const userModel = require('./models/user.model');

db.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
})

db.sync({
    force: false
}).then(() => {
    repairModel.belongsTo(userModel, { foreignKey: 'userId' });
    console.log("Database has been synced , the models are synced.");
}).catch(err => {
    console.error('Unable to sync database:', err);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

