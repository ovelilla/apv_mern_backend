import mongoose from "mongoose";
import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistrar from "../helpers/emailRegistro.js"
import emailRecuperar from "../helpers/emailRecuperar.js";

const registrar = async (req, res) => {
    const { nombre, email } = req.body;

    const existeUsuario = await Usuario.findOne({ email });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const usuario = new Usuario(req.body);
        const usuarioGuardado = await usuario.save();

        emailRegistrar({
            nombre,
            email,
            token: usuarioGuardado.token
        });

        res.json({ usuarioGuardado, msg: 'Usuario creado correctamente, revisa tu email' });
    } catch (error) {
        console.log(error)
    }
}

const perfil = (req, res) => {
    const { usuario } = req;
    res.json(usuario);
}

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ token });

    if (!usuario) {
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuario.token = null;
        usuario.confirmado = true;

        await usuario.save();

        res.json({ msg: 'Usuario confirmado correctamente' });
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(403).json({ msg: error.message });
    }

    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    if (!await usuario.comprobarPassword(password)) {
        const error = new Error('El password es incorrecto');
        return res.status(403).json({ msg: error.message });
    }

    res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id),
    });
}

const recuperar = async (req, res) => {
    const { email } = req.body;

    const existeUsuario = await Usuario.findOne({ email });

    if (!existeUsuario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeUsuario.token = generarId();

        await existeUsuario.save();

        emailRecuperar({
            nombre: existeUsuario.nombre,
            email,
            token: existeUsuario.token
        });

        res.json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Usuario.findOne({ token });

    if (!tokenValido) {
        const error = new Error('Token no válido');
        return res.status(400).json({ msg: error.message });
    }

    res.json({ msg: 'Introduce tu nuevo password' });
}

const restablecer = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });

    if (!usuario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        usuario.token = null;
        usuario.password = password;

        await usuario.save();
        res.json({ msg: 'Password actualizado correctamente' });
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
    const { id } = req.params;
    const { Types: { ObjectId: { isValid } } } = mongoose;

    if (!isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(404).json({ msg: error.message });
    }

    const usuario = await Usuario.findById(id);

    if (!usuario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body;
    if (usuario.email !== email) {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            const error = new Error('El email ya está en uso');
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.web = req.body.web;
        usuario.telefono = req.body.telefono;

        const usuarioActualizado = await usuario.save();

        res.json({ msg: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    const { id } = req.usuario;
    const { password_actual, password_nuevo } = req.body;

    const usuario = await Usuario.findById(id);

    if (!usuario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    if (!await usuario.comprobarPassword(password_actual)) {
        const error = new Error('El password actual es incorrecto');
        return res.status(403).json({ msg: error.message });
    }

    try {
        usuario.password = password_nuevo;

        await usuario.save();

        res.json({ msg: 'Password actualizado correctamente' });
    } catch (error) {
        console.log(error);
    }
}

export { registrar, perfil, confirmar, autenticar, recuperar, comprobarToken, restablecer, actualizarPerfil, actualizarPassword }