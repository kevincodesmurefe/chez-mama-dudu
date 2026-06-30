const express = require('express');
const router = express.Router();
const { getProducts, getProductById, insertProduct, updateProducts, updateStatus } = require('../controllers/productControllers');

router.get ('/', getProducts);
router.get ('/:id', getProductById);
router.post ('/', insertProduct);
router.put ('/:id', updateProducts);
router.put ('/status/:id', updateStatus);

module.exports = router;