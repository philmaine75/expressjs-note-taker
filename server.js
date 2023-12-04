const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/index');
const { v4: uuidv4 } = require('uuid'); // Corrected import

const PORT = process.env.PORT || 3001;

const app = express();

const fs = require('fs').promises;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/', apiRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.get('/api/notes', async (req, res) => {
    try {

        const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf-8');
        const notes = JSON.parse(data);
        return res.json(notes);
    } catch (error) {
        console.error('cannot get notes:', error);
        next(error);
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const newNote = {
            id: uuidv4(), 
            title: req.body.title,
            text: req.body.text,
        };

        const data = await fs.readFile(path.join(__dirname, 'db/db.json'), 'utf-8');
        const notes = JSON.parse(data);

        notes.push(newNote);

        await fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2), 'utf-8');
        return res.json(newNote);
    } catch (error) {
        console.error('Error adding newNote', error);
        next(error);
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);
