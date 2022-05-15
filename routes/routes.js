import { Router } from'express';
const router = Router();
import db from'../db/index.js';

router.get('/', async (req, res, next) => {
    try {
        await db.read();
        if(db.data.length) {
            res.status(200).json(db.data);
        }
        else {
            res.status(200).json({ message: 'No todos' });
        }
    }
    catch(e) {
        console.error('***** GET ALL TODOS ***********')
        next(e)
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        await db.read();
        if(!db.data.length) {
            return res.status(400).json({message: "No todos"})
        }
        const todo = db.data.find( todo => todo.id === id);

        if(!todo) {
            return res.status(400).json({message: 'No todo with this id'})
        }

        res.status(200).json(todo);
    }
    catch(e) {
        console.error('******* GET BY ID *********');
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    const text = req.body.text;

    if(!text) {
        return res.status(400).json({message: 'No body text'});
    }

    try {
        await db.read()

        const newTodo = {
            id: String(db.data.length + 1),
            text,
            done: false
        }

        db.data.push(newTodo);
        await db.write();
        res.status(200).json(db.data);
    }
    catch(e) {
        console.error('***** CREATE TODO *****');
        next(e);
    }
});

router.put('/:id', async (req, res, next) => {
    const id = req.params.id;

    if(!id) {
        return res.status(400).json({message: 'no id'});
    }

    const changes = req.body.changes;

    if(!changes) {
        return res.status(400).json({message: 'no changes'});
    }

    try {
        await db.read();

        const todo = db.data.find(todo => todo.id === id);
        if(!todo) {
            return res.status(400).json({message: 'not found this id'});
        }

        const updatedTodo = { ...todo, ...changes};
        const newTodos = db.data.map(x => (x.id === id ? updatedTodo : x));

        db.data = newTodos;
        await db.write();
    }
    catch(e) {
        console.error('**** UPDATE TODO ****');
        next(e);
    }
});

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    if(!id) {
        return res.status(400).json({message: 'no id'});
    }

    try {
        await db.read();

        const todo = db.data.find(x => x.id === id);

        if(!todo) {
            return res.status(400).json({message: 'Not found id'});
        }

        const newTodos = db.data.filter(x => x.id !== id);

        db.data = newTodos;

        await db.write();
        res.status(201).json(db.data);
    }
    catch(e) {
        console.error('**** REMOVE TODO *****');
        next(e);
    }
})

export default router;