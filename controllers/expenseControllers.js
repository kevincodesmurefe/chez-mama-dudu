const pool = require('../db/connection.js');

const getExpenses = async (req,res) => {
    try {
        const select = `SELECT * FROM expenses ORDER BY id`;
        const result = await pool.query(select);
        if (result.rowCount > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
}

const insertExpense = async (req,res) => {
    try {
    const { description, category, amount } = req.body;
    
    if (!description || !category || !amount) {
    return res.status(400).json({
        message: 'All fields are required'
    });
}
    const insert = `INSERT INTO expenses (description, category, amount, date, status) VALUES ( $1, $2, $3, CURRENT_TIMESTAMP, 'paid' )`;
    const result = await pool.query(insert,[ description, category, amount ]);
    if ( result.rowCount > 0 ) {
        res.status(201).json({ message: 'New expense created successfully' });
    } else {
        res.status(500).json({ message: 'no expense created'});
    }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
    
}

const getExpenseById = async (req,res) => {
       try {
        const id = req.params.id;
        const select = `SELECT * FROM expenses WHERE id = $1`;
        const result = await pool.query(select,[id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({message: 'expense not found'});
        }
       } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
       }
}

const updateExpense = async (req,res) => {
    try {
        const id = req.params.id;
        const { description, category, amount } = req.body;
        const update = `UPDATE expenses SET description = $1, category = $2, amount = $3 WHERE id = $4`;
        const result = await pool.query(update, [description, category, amount, id]);
        if (result.rowCount > 0) {
            res.status(200).json({message: 'expense updated succesfully'});
        } else {
            res.status(404).json({message: 'expense not found'});
        }
    } catch (error) {
       console.error(error.message);
       res.status(500).send('server error'); 
    }
}

const updateStatus = async (req,res) => {
    try {
        const id = req.params.id;
        const {status} = req.body;
        const allowedStatuses = ['paid', 'void', 'pending'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status'
            });
        }  

        const update = `UPDATE expenses SET status = $1 WHERE id = $2`;
        const result = await pool.query(update,[ status, id ]);
        if (result.rowCount > 0) {
            res.status(200).json({message: 'expense updated succesfully'});
        } else {
            res.status(404).json({message: 'expense not found'});
        }
    } catch (error) {
        console.error(error.message);
       res.status(500).send('server error');
    }
}

module.exports = { getExpenses, getExpenseById , insertExpense, updateExpense, updateStatus};