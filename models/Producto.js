const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  codigo:           { type: String, required: true, unique: true, trim: true },
  codigo_proveedor: { type: String, trim: true, default: '' },
  nombre:           { type: String, required: true, trim: true },
  marca:            { type: String, trim: true, default: '' },
  categoria:        { type: String, trim: true, default: '' },
  descripcion:      { type: String, trim: true, default: '' },
  imagen:           { type: String, default: '' }, // nombre de archivo en /public/img/
}, {
  timestamps: true
});

// índice de búsqueda de texto
productoSchema.index({ codigo: 'text', nombre: 'text', marca: 'text' });

module.exports = mongoose.model('Producto', productoSchema);
