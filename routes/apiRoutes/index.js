const router = require('express').Router();
const fs = require('fs');
const util = require('util');
const dbPath = './db/db.json';
const path = require('path');

const readTheFile = util.promisify(fs.readFile);


const RandomId = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
   .toString(16)
   .substring(1);
};


const writeTheFile = (location, data) => {
    fs.writeFile(location, JSON.stringify(data), (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
};

const appendTheFile = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedNote = JSON.parse(data);
            parsedNote.push(content);
            writeTheFile(file, parsedNote);
        }
    });
}

router.get('/', (req, res) => {
    readTheFile(dbPath).then((data) => res.json(JSON.parse(data)));
});

router.post('/', (req, res) => {
const { title, text} = req.body
if (title && text ) {

    const newNote = {
        title,
        text,
        id: RandomId(),
    }

appendTheFile(newNote, dbPath)
}
});

router.get('/:id', (req, res) => {
    const requestedId = req.params.id;

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const notes = JSON.parse(data);
        const foundNote = notes.find(note => note.id === requestedId);

        if (foundNote) {
            return res.json(foundNote);
        } else {
            return res.status(404).json({ error: 'Note not found' });
        }
    });
});

router.delete('/:id', (req, res) => {
    const requestedId = req.params.id;

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let notes = JSON.parse(data);
        const initialLength = notes.length;

        notes = notes.filter(note => note.id !== requestedId);

        if (notes.length < initialLength) {
            writeTheFile(dbPath, notes);
            res.json({ message: 'Note deleted successfully' });
        } else {
            res.status(404).json({ error: 'Note not found' });
        }
    });
});


module.exports = router;