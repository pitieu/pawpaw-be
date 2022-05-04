const Service = require('../model/ServiceModel');

function getService(query) {
    return Service.get(query, (result) => {
        return result;
    })
}

exports.listServices = (req, res, next) => {
    return getService({ userid: req.user.id })
};

exports.listService = (req, res, next) => {
    return getService({ userid: req.user.id })
};

exports.getService = (req, res, next) => {
    return getService({ _id: req.serviceId })
};

exports.updateService = (req, res, next) => {
    const updateData = {
        name: req.name,
        description: req.description,
        location: req.location,
        photos: req.photos,
        product: req.products,
        productAddon: req.productAddon,
        pricePerKm: req.pricePerKm,
    }
    return Service.updateOne({ _id: req.serviceId, userId: req.user.id }, updateData, (result) => {
        return result;
    })
};

exports.deleteService = (req, res, next) => {
    // services flagged as deleted should be deleted after a certain period
    const deleteData = {
        deletedAt: new Date(),
        deleted: true
    };

    return Service.updateOne({ _id: req.serviceId, userId: req.user.id }, deleteData, (result) => {
        return result;
    });
};


exports.addService = (req, res, next) => {
    return req;
}