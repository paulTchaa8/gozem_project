const Package = require('../models/package')

exports.getAllPackages = async (req, res) => {
  const packages = await Package.find()
  res.status(200).json(packages)
}

exports.getPackageById = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id)
    if (!package) {
        return res.status(404).json({ message: 'Package not found' })
    }
    res.status(200).json(package)
  } catch (error) {
      res.status(400).json({ message: 'Failed to get package', error })
  }
}

exports.createPackage = async (req, res) => {
  const package = new Package(req.body)
  await package.save()
  res.status(201).json({message: 'Package created', package})
}

exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    )
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' })
    }
    res.status(200).json({ message: 'Package updated successfully', pkg })
  } catch (error) {
    res.status(400).json({ message: 'Failed to update package', error })
  }
}

exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndDelete(req.params.id)
    if (!package) {
        return res.status(404).json({ message: 'Package not found' })
    }
    res.status(204).json({ message: 'Package deleted successfully' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete package', error })
  }
}