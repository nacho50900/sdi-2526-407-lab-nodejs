module.exports = {
    mongoClient: null,
    app: null,
    database: "musicStore",
    collectionName: "favourite_songs",
    init: function (app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },
    getSongs: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const col = database.collection(this.collectionName);
            return await col.find(filter, options).toArray();
        } catch (error) {
            throw (error);
        }
    },
    addSong: function (song, callbackFunction) {
        this.dbClient.connect()
            .then(() => {
                const database = this.dbClient.db(this.database);
                const col = database.collection(this.collectionName);
                col.insertOne(song)
                    .then(result => callbackFunction({songId: result.insertedId}))
                    .then(() => this.dbClient.close())
                    .catch(err => callbackFunction({error: err.message}));
            })
            .catch(err => callbackFunction({error: err.message}));
    },
    removeSong: async function (filter) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const col = database.collection(this.collectionName);
            return await col.deleteOne(filter);
        } catch (error) {
            throw (error);
        }
    }
};