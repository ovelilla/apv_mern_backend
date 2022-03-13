import mongoose from "mongoose";
import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.usuario._id

    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.usuario);

    res.json(pacientes);
}

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    const { Types: { ObjectId: { isValid } } } = mongoose;

    if (!isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(404).json({ msg: error.message });
    }

    const paciente = await Paciente.findById(id);

    if (!paciente) {
        const error = new Error('Paciente no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    if (paciente.veterinario._id.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(403).json({ msg: error.message });
    }

    res.json(paciente);
}

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const { Types: { ObjectId: { isValid } } } = mongoose;

    if (!isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(404).json({ msg: error.message });
    }

    const paciente = await Paciente.findById(id);

    if (!paciente) {
        const error = new Error('Paciente no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    if (paciente.veterinario._id.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(403).json({ msg: error.message });
    }

    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
}

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const { Types: { ObjectId: { isValid } } } = mongoose;

    if (!isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(404).json({ msg: error.message });
    }

    const paciente = await Paciente.findById(id);

    if (!paciente) {
        const error = new Error('Paciente no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    if (paciente.veterinario._id.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(403).json({ msg: error.message });
    }

    try {
        await paciente.deleteOne();
        res.json({ msg: 'Paciente eliminado' });
    } catch (error) {
        console.log(error);
    }
}

export { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente }
