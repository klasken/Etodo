const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
const authRouter = require('./routes/auth');
const todosRouter = require('./routes/todos');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/todos', todosRouter);
app.use('/', userRouter);

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
