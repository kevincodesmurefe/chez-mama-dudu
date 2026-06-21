const pool = require('../db/connection.js');
const getProducts = async (req,res) => {
    try {
        const result = await pool.query('SELECT * FROM product ORDER BY id');
        if (result.rows.length > 0){
        res.json(result.rows);
        } else {
          res.status(200).json([]);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}


const insertProduct = async (req, res) => {
    try {
        const { name, category, cost_price, sell_price, stock_quantity } = req.body;

        const select = `SELECT * FROM product WHERE name = $1 AND category = $2`;
        const exist = await pool.query(select, [name, category]);

        if (exist.rows.length > 0) {
            const newQuantity = Number(exist.rows[0].stock_quantity) + Number(stock_quantity);

            const update = `UPDATE product SET cost_price = $1, sell_price = $2, stock_quantity = $3 WHERE name = $4 AND category = $5`;
            await pool.query(update, [cost_price, sell_price, newQuantity, name, category]);
            res.status(200).json({ message: 'Product saved successfully' });

        } else {
            const insert = ` INSERT INTO product (name, category, cost_price, sell_price, stock_quantity, time_added, status) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, 'active') `;
            await pool.query(insert, [name, category, cost_price, sell_price, stock_quantity]);
            res.status(200).json({ message: 'New product saved successfully' });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}

const getProductById = async (req, res) => {
    try{
    const id = req.params.id;
        const select = `SELECT * FROM product WHERE id = $1`;
        const result = await pool.query(select,[id]);
        if (result.rows.length > 0){
        res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
    } catch (error){
   console.error(error.message);
        res.status(500).send('Server Error');
    }
}

const updateProducts = async (req,res) => {
    try {
        const id = req.params.id;
    const { name, category, cost_price, sell_price, stock_quantity } = req.body;
    const update = `UPDATE product SET name = $1, category = $2, cost_price = $3, sell_price = $4, stock_quantity = $5 WHERE id = $6`;
           const result = await pool.query(update, [name, category, cost_price, sell_price, stock_quantity, id]);
            if (result.rowCount > 0) {
            res.status(200).json({ message: 'Product updated successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
    
}

const updateStatus = async (req,res) => {
    try {
        const id = req.params.id;
        const {status} = req.body;
        const update = `UPDATE product SET status = $1 WHERE id = $2`;
        const result = await pool.query(update, [ status, id ]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Product updated successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}

module.exports = { getProducts, getProductById, insertProduct, updateProducts, updateStatus };
