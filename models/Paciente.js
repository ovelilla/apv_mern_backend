import mongoose from "mongoose";

const pacienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    propietario: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true
    },
    fecha: {
        type: Date,
        default: Date.now(),
        require: true,
        trim: true
    },
    sintomas: {
        type: String,
        require: true,
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, {
    timestamps: true
});


const Paciente = mongoose.model('Paciente', pacienteSchema);

export default Paciente;
