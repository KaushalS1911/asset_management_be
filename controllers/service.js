const ServiceModel = require("../models/services")

async function addService(req,res){
    try {
        const {
            asset, start_date, end_date, service_by, service_person,
            service_person_contact, sended_by, received_by, receiver_contact,
            remark, status
        } = req.body;

        const service = await ServiceModel.create({
            asset, start_date, end_date, service_by, service_person,
            service_person_contact, sended_by, received_by, receiver_contact,
            remark, status
        });

        return res.status(201).json({ data: service, message: "Service details added successfully" });
    } catch (err) {
        console.error("Error creating service:", err.message);
        return res.status(500).json({ error: "Failed to create service" });
    }
}

async function allService(req,res){
    try {
        const services = await ServiceModel.find({}).populate('asset');
        return res.json(services);
    } catch (err) {
        console.error("Error fetching services:", err.message);
        return res.status(500).json({ error: "Failed to fetch services" });
    }
}

async function singleService(req,res){
    try {
        const service = await ServiceModel.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        return res.json(service);
    } catch (err) {
        console.error("Error fetching service:", err.message);
        return res.status(500).json({ error: "Failed to fetch service" });
    }
}

async function updateService(req,res){
    try {
        const { id } = req.params;
        const updatedService = await ServiceModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedService) {
            return res.status(404).json({ error: "Service not found" });
        }
        return res.status(200).json({ data: updatedService, message: "Service updated successfully" });
    } catch (err) {
        console.error("Error updating service:", err.message);
        return res.status(500).json({ error: "Failed to update service" });
    }
}

async function deleteService(req,res){
    try {
        const service = await ServiceModel.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }
        return res.json({ message: "Service deleted successfully" });
    } catch (err) {
        console.error("Error deleting service:", err.message);
        return res.status(500).json({ error: "Failed to delete service" });
    }
}


module.exports = {addService, allService, singleService, updateService, deleteService}