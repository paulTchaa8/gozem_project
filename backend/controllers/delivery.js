const Delivery = require('../models/delivery')

exports.createDelivery = async (req, res, next) => {
    try {
    const delivery = new Delivery(req.body)
    await delivery.save()
    res.status(201).json({message: 'Delivery created', delivery})
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id)
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' })
        }
        res.status(200).json(delivery)
    } catch (error) {
        res.status(400).json({ message: 'Failed to get delivery', error })
    }
}

exports.getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find()
        res.status(200).json(deliveries)
    } catch (error) {
        res.status(400).json({ message: 'Failed to get deliveries', error })
    }
}

exports.updateDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' })
        }
        res.status(200).json({ message: 'Delivery updated successfully', delivery })
    } catch (error) {
        res.status(400).json({ message: 'Failed to update delivery', error })
    }
}

exports.updateStatusDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' })
        }
        res.status(200).json({ message: 'Delivery status updated !', delivery })
    } catch (error) {
        res.status(400).json({ message: 'Failed to update delivery status', error })
    }
}

exports.deleteDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndDelete(req.params.id)
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' })
        }
        res.status(204).json({ message: 'Delivery deleted successfully' })
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete delivery', error })
    }
}