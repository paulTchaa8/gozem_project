const express = require('express')
const router = express.Router()

const deliveryController = require('../controllers/delivery')

router.post('/', deliveryController.createDelivery)
router.get('/:id', deliveryController.getDeliveryById)
router.get('/', deliveryController.getAllDeliveries)
router.put('/:id', deliveryController.updateDelivery)
router.put('/:id/status', deliveryController.updateStatusDelivery)
router.delete('/:id', deliveryController.deleteDelivery)


module.exports = router