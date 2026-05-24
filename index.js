

const express = require('express');
const { sql, getConnection } = require('./db');
const cors = require('cors');
const animauxRoutes = require('./routes/animaux');
const authRoutes = require('./routes/auth.routes');
const {logout} = require('./authentication/authMiddleware');
const cookieParser = require('cookie-parser');
const app = express();



app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    try{
        res.send('API is running');
        console.log("GET / hit");
    }catch(err){
        console.log(err);
    }

});

app.get('/test-cookie', (req, res) => {
    console.log(req.cookies);

    res.json(req.cookies);
});

app.get('/testError', (req, res, next) => {
    console.log('Throwing error');
    const error = new Error("My error!");
    error.status = 404;
    next(error);
});

app.use(`/animaux`, animauxRoutes);

app.use(`/auth`, authRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    console.error(err);

    if (process.env.NODE_ENV === "development") {

        return res.status(500).json({
            message: err.message,
            stack: err.stack
        });

    }

    res.status(500).json({
        message: "Internal server error"
    });
});

app.listen(3000, () => {
    console.log('API running on http://localhost:3000. You can connect to PersonnesEtAnimaux_');
});