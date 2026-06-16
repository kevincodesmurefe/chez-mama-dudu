const pool = require('../db/connection.js');
const getProducts = async (req,res) => {
    try {
        const result = await pool.query('SELECT * FROM product ORDER BY product_id');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}


const insertProduct = async (req,res) => {
    try {
        const data = req.body;
         const select = `SELECT * FROM product WHERE name = '${data.name}' AND category = '${data.category}'`;
         const exist = await pool.query(select);
         if (exist.rows.length > 0) {
            const newQuantity =  Number(exist.rows[0].stock_quantity) +  Number(data.stock_quantity);;
            const update = `UPDATE product SET cost_price = '${data.cost_price}', sell_price = '${data.sell_price}', stock_quantity = ${newQuantity} WHERE name = '${data.name}' AND category = '${data.category}'`;
            await pool.query(update);
            res.status(200).json({message: 'Product saved successfully'});
         }else{
              const insert = `INSERT INTO product (name, category, cost_price, sell_price, stock_quantity,time_added) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`;
              await pool.query(insert,[data.name, data.category, data.cost_price, data.sell_price, data.stock_quantity]);
              res.status(200).json({message: 'New product saved successfully'});
         }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}