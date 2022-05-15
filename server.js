import express from'express';
const app = express();
import router from'./routes/routes.js';

app.use(express.json());
app.use('/api', router);

app.get('*', (req, res) => {
    res.send('Only /api available');
});

app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Something wrong'
    res.status(status).json({message});
});

app.listen(3333, () => {
    console.log('blast-off on http://localhost:3333');
});