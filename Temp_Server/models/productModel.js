const mongoose = require('mongoose');

const temperatureSchema = mongoose.Schema(
    {
        cityName: {
            type: String,
            required: [true, "Please enter a temperature name"]
        },
        state: {
            type: String,
            required: true,
            default: 0
        },
        minTemp: {
            type: Number,
            required: true,
        },
        maxTemp: {
            type: Number,
            required: false,
        }
    },
    {
        timestamps: true
    }
)


const Temperature = mongoose.model('temperature', temperatureSchema);

module.exports = Temperature;


