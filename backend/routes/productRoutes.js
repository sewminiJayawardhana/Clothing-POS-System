const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/:code', productController.getProductByCode);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);

module.exports = router;
