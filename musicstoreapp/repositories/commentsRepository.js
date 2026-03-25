module.exports = {
    mongoClient: null,
    app: null,
    database: "musicStore",
    collectionName: "comments",
    init: function (app, dbClient) {
        this.dbClient = dbClient;
        this.app = app;
    },
    getComments: async function (filter, options) {
        try {
            await this.dbClient.connect();
            const database = this.dbClient.db(this.database);
            const col = database.collection(this.collectionName);
            return await col.find(filter, options).toArray();
        } catch (error) {
            throw (error);
        }
    },
    addComment: function (comment, callbackFunction) {
        this.dbClient.connect()
            .then(() => {
                const database = this.dbClient.db(this.database);
                const col = database.collection(this.collectionName);
                col.insertOne(comment)
                    .then(result => {
                        callbackFunction({commentId: result.insertedId});
                    })
                    .catch(err => callbackFunction({error: err.message}));
            })
            .catch(err => callbackFunction({error: err.message}));
    }
}