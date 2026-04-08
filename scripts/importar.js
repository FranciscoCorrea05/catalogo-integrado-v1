/**
 * scripts/importar.js
 * Uso: node scripts/importar.js [ruta-al-excel]
 * Default: busca productos.xlsx en la raíz del proyecto
 */

const path    = require('path');
const mongoose = require('mongoose');
const XLSX    = require('xlsx');
const Producto = require('../models/Producto');

const ARCHIVO = process.argv[2] || path.join(__dirname, '../productos.xlsx');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/catalogo';

async function importar() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB conectado');

  const wb   = XLSX.readFile(ARCHIVO);
  const hoja = wb.Sheets[wb.SheetNames[0]];
  const datos = XLSX.utils.sheet_to_json(hoja);

  console.log(`📦 ${datos.length} filas encontradas en el Excel`);

  let insertados = 0, actualizados = 0, errores = 0;

  for (const row of datos) {
    const codigo = String(row['Código'] || row['codigo'] || '').trim();
    if (!codigo) { errores++; continue; }

    const doc = {
      codigo_proveedor: String(row['Cód.Arti.Prov.'] || row['codigo_proveedor'] || '').trim(),
      nombre:           String(row['Descripción']    || row['nombre']           || '').trim(),
      marca:            String(row['Marca']          || row['marca']            || '').trim(),
      categoria:        String(row['Categoría']      || row['categoria']        || '').trim(),
      descripcion:      String(row['Detalle']        || row['descripcion']      || '').trim(),
    };

    if (!doc.nombre) { errores++; continue; }

    const result = await Producto.findOneAndUpdate(
      { codigo },
      { $set: doc },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // detectar si fue insert o update
    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      insertados++;
    } else {
      actualizados++;
    }
  }

  console.log(`✅ Importación completa:`);
  console.log(`   Nuevos:      ${insertados}`);
  console.log(`   Actualizados: ${actualizados}`);
  console.log(`   Ignorados:    ${errores} (sin código o sin nombre)`);

  await mongoose.disconnect();
  process.exit(0);
}

importar().catch(err => {
  console.error('❌ Error en importación:', err);
  process.exit(1);
});
