const router = require('express').Router();
const fs = require('fs');
const util = require('util');

const readTheFile = util.promisify(fs.readFile);

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
    readTheFile(`./db/db.json`).then((data) => res.json(JSON.parse(data)));
});

router.post('/', (req, res) => {
const { title, text} = req.body
if (title && text ) {

    const newNote = {
        title,
        text,
    }

appendTheFile(newNote, './db/db.json')
}
});


module.exports = router;