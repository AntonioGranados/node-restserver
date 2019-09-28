const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();
let Producto = require('../models/producto');

//Obtener todos los productos

app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    producto,
                    cuantos: conteo
                });
            })
        });
});

//Obtener producto por ID
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

//Buscar Productos
app.get('/productos/buscar/:palabraABuscar', verificaToken, (req, res) => {
    let palabraABuscar = req.params.palabraABuscar;

    //Se crea una expresion regular donde se le envia la palabra a buscar, y una i para que acepte mayusc y minusc
    let regex = new RegExp(palabraABuscar, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productosDB
            });

        })

})


//Crear producto
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo crear el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//Actualizar producto
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se pudo actualizar el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//Eliminar un producto
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo Eliminar el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoEliminado,
            message: 'Producto Eliminado Correctamente'
        });
    });
});


module.exports = app;