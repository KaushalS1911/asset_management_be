const mongoose = require('mongoose')


const serviceStatus = {
    IN_SERVICE : "in service",
    COMPLETED: "completed",
    NOT_REPAIRABLE: "not repairable"
}


const serviceSchema = new mongoose.Schema({
    asset: String,
    start_date: Date,
    end_date: Date,
    service_by: String,
    service_person: String,
    service_person_contact: String,
    service_cost: Number,
    sended_by: String,
    received_by: String,
    receiver_contact: String,
    remark: String,
    status: {type: String, enum: [serviceStatus.IN_SERVICE, serviceStatus.COMPLETED, serviceStatus.NOT_REPAIRABLE]},
}, {timestamps: true})


module.exports = mongoose.model('Service', serviceSchema)


