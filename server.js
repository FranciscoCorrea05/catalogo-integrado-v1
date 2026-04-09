const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const compression = require('compression');
const path       = require('path');
const Producto   = require('./models/Producto');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/catalogo';
const WA_VENTAS = process.env.WA_VENTAS || '5493415317707';

// ─── Middlewares ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── MongoDB ──────────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// ─── Helper: nav + footer parciales ──────────────────────────────────────────
function navHtml(paginaActual = '') {
  const links = [
    ['/', 'Inicio'],
    ['/catalogo', 'Catálogo'],
    ['/#marcas', 'Marcas'],
    ['/#contacto', 'Contacto'],
  ];
  return `
<nav>
  <a href="/" class="nav-logo-link">
    <img src="/img/logo.jpg" alt="BGM Diesel – Repuestos para Camiones" class="nav-logo-img" width="160" height="52">
  </a>
  <ul class="nav-links" id="navLinks">
    ${links.map(([href, label]) => `
      <li><a href="${href}"${paginaActual === label ? ' aria-current="page"' : ''}>${label}</a></li>
    `).join('')}
    <li>
      <a href="/carrito" class="nav-carrito-link">
        🛒 <span id="nav-carrito-count">0</span>
      </a>
    </li>
  </ul>
  <button class="nav-hamburger" id="navHamburger" aria-label="Abrir menú" aria-expanded="false">&#9776;</button>
  <a class="nav-cta" href="https://wa.me/${WA_VENTAS}" target="_blank" rel="noopener">💬 WhatsApp</a>
</nav>`;
}

function footerHtml() {
  return `
<footer>
  <div class="footer-top">
    <div>
      <div class="footer-logo">BGM<span>·</span>DIESEL</div>
      <div class="footer-tagline">Repuestos para camiones · Rosario, Santa Fe · Argentina</div>
    </div>
    <div class="footer-col">
      <h3>Navegación</h3>
      <a href="/">Inicio</a>
      <a href="/catalogo">Catálogo</a>
      <a href="/#marcas">Marcas</a>
      <a href="/#contacto">Contacto</a>
    </div>
    <div class="footer-col">
      <h3>Contacto</h3>
      <a href="tel:+543417926696">(0341) 792-6696</a>
      <a href="tel:+543414312003">(0341) 431-2003</a>
      <a href="mailto:ventas@bgmdiesel.com.ar">ventas@bgmdiesel.com.ar</a>
      <p>Bv. 27 de Febrero 3447, Rosario</p>
    </div>
    <div class="footer-col">
      <h3>Redes</h3>
      <a href="https://www.instagram.com/bgmdiesel/" target="_blank" rel="noopener">📷 Instagram</a>
      <a href="https://www.google.com/maps/place/B.G.M.+DIESEL/@-32.9620372,-60.6756382,15z" target="_blank" rel="noopener">🗺️ Google Maps</a>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 B.G.M Diesel · Todos los derechos reservados</span>
    <span>Repuestos para camiones · Rosario · Santa Fe · Argentina</span>
  </div>
</footer>
<a href="https://wa.me/${WA_VENTAS}" class="wa-float" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">
  <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
    <path fill="white" d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.7 5.5 2.1 7.9L.2 31.8l8.1-2.2c2.3 1.3 4.9 2 7.7 2 8.6 0 15.6-7 15.6-15.6S24.6.4 16 .4zm0 28.6c-2.5 0-4.9-.7-7-2l-.5-.3-4.8 1.3 1.3-4.7-.3-.5c-1.3-2.1-2-4.5-2-7 0-7.2 5.9-13 13-13s13 5.9 13 13-5.8 13-13 13zm7.2-9.7c-.4-.2-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2s-1 1.2-1.2 1.4c-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-2-1.1-1-1.8-2.3-2-2.7-.2-.4 0-.6.1-.8l.6-.6c.2-.2.2-.4.3-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.8c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.2s1.3 3.7 1.5 3.9c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.2.8.9.3 1.7.3 2.3.2.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z"/>
  </svg>
</a>
<script>
  // Nav carrito badge
  (function(){
    var cart = JSON.parse(localStorage.getItem('bgm_cart') || '{}');
    var count = Object.values(cart).reduce(function(s,i){return s+i.cantidad;},0);
    var el = document.getElementById('nav-carrito-count');
    if(el){ el.textContent = count > 0 ? count : ''; }
  })();
  // Hamburger
  (function(){
    var btn = document.getElementById('navHamburger');
    var links = document.getElementById('navLinks');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.innerHTML = open ? '&#10005;' : '&#9776;';
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
        btn.innerHTML = '&#9776;';
      });
    });
  })();
</script>`;
}

// ─── HEAD parcial ─────────────────────────────────────────────────────────────
function headHtml({ title, desc, canonical = '' }) {
  return `<!DOCTYPE html>
<html lang="es-AR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  ${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/jpeg" href="/img/logo.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap"></noscript>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUTAS DE PÁGINAS (SSR)
// ═══════════════════════════════════════════════════════════════════════════════

// GET /  → Index institucional (sirve el HTML estático que está en public/)
// Express ya lo sirve via static, pero si queremos control total:
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// GET /catalogo  → Listado SSR con paginación y búsqueda
app.get('/catalogo', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 24;
    const q     = (req.query.q || '').trim();
    const marca = (req.query.marca || '').trim();

    const filtro = {};
    if (q) {
      filtro.$or = [
        { codigo:  { $regex: q, $options: 'i' } },
        { nombre:  { $regex: q, $options: 'i' } },
        { codigo_proveedor: { $regex: q, $options: 'i' } },
      ];
    }
    if (marca) filtro.marca = { $regex: marca, $options: 'i' };

    const [total, productos, marcas] = await Promise.all([
      Producto.countDocuments(filtro),
      Producto.find(filtro, 'codigo codigo_proveedor nombre marca imagen')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Producto.distinct('marca'),
    ]);

    const totalPaginas = Math.ceil(total / limit);

    const filasHtml = productos.map(p => {
      const img   = p.imagen || `${p.codigo}.webp`;
      const msgWa = encodeURIComponent(`Hola, consulto por ${p.nombre} (Código: ${p.codigo})`);
      return `
      <article class="prod-card-item" itemscope itemtype="https://schema.org/Product">
        <a href="/producto/${p.codigo}" class="prod-card-img-link" tabindex="-1" aria-hidden="true">
          <div class="prod-card-img-wrap">
            <img
              src="/img/${img}"
              alt="${p.nombre} – Código ${p.codigo} | BGM Diesel"
              width="260" height="200"
              loading="lazy"
              onerror="this.onerror=null;this.src='/img/default.webp'"
              itemprop="image"
            >
          </div>
        </a>
        <div class="prod-card-body">
          ${p.marca ? `<span class="prod-card-marca" itemprop="brand">${p.marca}</span>` : '<span class="prod-card-marca-empty"></span>'}
          <a href="/producto/${p.codigo}" class="prod-card-nombre" itemprop="name">${p.nombre}</a>
          <span class="prod-card-codigo">Cód: <strong>${p.codigo}</strong></span>
        </div>
        <div class="prod-card-footer">
          <button
            class="prod-card-btn-carrito btn-carrito-mini"
            data-codigo="${p.codigo}"
            data-nombre="${p.nombre}"
            aria-label="Agregar ${p.nombre} al pedido"
          >🛒 Agregar al pedido</button>
          <div class="prod-card-btns-sec">
            <a
              href="https://wa.me/${WA_VENTAS}?text=${msgWa}"
              class="prod-card-btn-wa"
              target="_blank" rel="noopener"
              aria-label="Consultar ${p.nombre} por WhatsApp"
            >💬 WhatsApp</a>
            <a
              href="/producto/${p.codigo}"
              class="prod-card-btn-ver"
              aria-label="Ver detalle de ${p.nombre}"
              itemprop="url"
            >Ver más</a>
          </div>
        </div>
      </article>`;
    }).join('');

    const paginacionHtml = totalPaginas > 1 ? `
    <div class="cat-pagination">
      ${page > 1 ? `<a href="/catalogo?q=${encodeURIComponent(q)}&marca=${encodeURIComponent(marca)}&page=${page-1}" class="pag-btn" aria-label="Página anterior">←</a>` : ''}
      ${Array.from({length: Math.min(totalPaginas, 7)}, (_, i) => {
        const n = i + 1;
        return `<a href="/catalogo?q=${encodeURIComponent(q)}&marca=${encodeURIComponent(marca)}&page=${n}"
                   class="pag-btn${n === page ? ' active' : ''}" aria-label="Página ${n}"${n === page ? ' aria-current="page"' : ''}>${n}</a>`;
      }).join('')}
      ${totalPaginas > 7 && page < totalPaginas ? `<span class="pag-sep">…</span><a href="/catalogo?q=${encodeURIComponent(q)}&marca=${encodeURIComponent(marca)}&page=${totalPaginas}" class="pag-btn">${totalPaginas}</a>` : ''}
      ${page < totalPaginas ? `<a href="/catalogo?q=${encodeURIComponent(q)}&marca=${encodeURIComponent(marca)}&page=${page+1}" class="pag-btn" aria-label="Página siguiente">→</a>` : ''}
    </div>` : '';

    const marcaOptions = marcas.filter(Boolean).sort().map(m =>
      `<option value="${m}"${marca === m ? ' selected' : ''}>${m}</option>`
    ).join('');

    res.send(`${headHtml({
      title: `Catálogo de Repuestos Diesel | BGM Diesel Rosario – Página ${page}`,
      desc: 'Catálogo completo de repuestos para camiones en Rosario. Mercedes Benz, Scania, Volvo, Cummins, Ford Cargo. Consultá stock por WhatsApp.',
      canonical: `https://www.bgmdiesel.com.ar/catalogo${page > 1 ? `?page=${page}` : ''}`,
    })}
${navHtml('Catálogo')}

<div id="notifContainer"></div>

<section class="cat-hero">
  <div class="label">Stock disponible</div>
  <h1>Catálogo de <em>Repuestos</em></h1>
  <p>Buscá por código, nombre o marca. ${total.toLocaleString('es-AR')} repuestos disponibles.</p>
</section>

<div class="cat-body">
  <form class="catalogo-toolbar" method="GET" action="/catalogo" role="search">
    <label for="buscador" class="sr-only">Buscar repuestos</label>
    <input type="search" id="buscador" name="q" class="catalogo-search"
           placeholder="Buscar por código o nombre…" value="${q}"
           autocomplete="off" aria-label="Buscar repuestos por código o nombre">
    <select name="marca" class="catalogo-select" aria-label="Filtrar por marca">
      <option value="">Todas las marcas</option>
      ${marcaOptions}
    </select>
    <button type="submit" class="btn-buscar" aria-label="Buscar">Buscar</button>
    ${(q || marca) ? `<a href="/catalogo" class="btn-limpiar" aria-label="Limpiar filtros">✕ Limpiar</a>` : ''}
    <span class="catalogo-count">${total.toLocaleString('es-AR')} resultado${total !== 1 ? 's' : ''}</span>
  </form>

  <main id="prod-cards-grid" class="prod-cards-grid" aria-label="Catálogo de productos">
    ${filasHtml || '<p class="catalogo-empty">No se encontraron productos para tu búsqueda.</p>'}
  </main>

  ${paginacionHtml}

  <div class="catalogo-aviso">
    <p>¿No encontrás lo que buscás? <strong>Consultanos directamente</strong>. Tenemos acceso a proveedores mayoristas y podemos conseguirte el repuesto que necesitás.</p>
    <a href="https://wa.me/${WA_VENTAS}" class="btn-primary" target="_blank" rel="noopener">💬 Consultar por WhatsApp</a>
  </div>
</div>

${footerHtml()}
<script src="/carrito.js" defer></script>
<script>
  // Búsqueda live (debounce)
  (function(){
    var input = document.getElementById('buscador');
    var form  = input.closest('form');
    var t;
    input.addEventListener('input', function(){
      clearTimeout(t);
      t = setTimeout(function(){ form.submit(); }, 500);
    });
    document.querySelector('.catalogo-select')?.addEventListener('change', function(){
      form.submit();
    });
  })();
</script>
</body></html>`);

  } catch (err) {
    console.error(err);
    res.status(500).send('<h1>Error interno</h1>');
  }
});

// GET /producto/:codigo  → Página de producto SSR (SEO-friendly)
app.get('/producto/:codigo', async (req, res) => {
  try {
    const codigo  = req.params.codigo.trim();
    const producto = await Producto.findOne({ codigo }).lean();

    if (!producto) {
      return res.status(404).send(`${headHtml({ title: 'Producto no encontrado | BGM Diesel', desc: '' })}
        ${navHtml()}
        <main style="padding:8rem 5vw; text-align:center;">
          <h1>Producto no encontrado</h1>
          <p style="margin:1rem 0">El código <strong>${codigo}</strong> no existe en nuestro catálogo.</p>
          <a href="/catalogo" style="color:var(--rojo)">← Volver al catálogo</a>
        </main>
        ${footerHtml()}
        </body></html>`);
    }

    const img = producto.imagen || `${producto.codigo}.webp`;
    const desc = producto.descripcion ||
      `Comprá ${producto.nombre} (código ${producto.codigo}) en BGM Diesel, Rosario. Consultá stock y precio por WhatsApp.`;
    const msgWa = encodeURIComponent(
      `Hola, quisiera consultar por ${producto.nombre} (Código: ${producto.codigo})`
    );

    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": producto.nombre,
      "description": desc,
      "sku": producto.codigo,
      "brand": producto.marca ? { "@type": "Brand", "name": producto.marca } : undefined,
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "BGM Diesel" }
      }
    });

    res.send(`${headHtml({
      title: `${producto.nombre} | BGM Diesel Rosario`,
      desc: desc.slice(0, 160),
      canonical: `https://www.bgmdiesel.com.ar/producto/${producto.codigo}`,
    })}
<script type="application/ld+json">${jsonLd}</script>
${navHtml()}

<main class="detalle-container" itemscope itemtype="https://schema.org/Product">

  <div class="detalle-grid">

    <div class="detalle-img-wrap">
      <img
        src="/img/${img}"
        alt="${producto.nombre} – Código ${producto.codigo} | BGM Diesel Rosario"
        width="480" height="480"
        onerror="this.onerror=null;this.src='/img/default.webp'"
        itemprop="image"
        fetchpriority="high"
      >
    </div>

    <div class="detalle-info">
      ${producto.marca ? `<p class="detalle-marca" itemprop="brand">${producto.marca}</p>` : ''}
      <h1 itemprop="name">${producto.nombre}</h1>

      <span class="detalle-badge">✓ Consultá disponibilidad y precio</span>

      <dl class="detalle-meta">
        <div class="detalle-meta-row">
          <dt>Código</dt>
          <dd itemprop="sku">${producto.codigo}</dd>
        </div>
        ${producto.categoria ? `
        <div class="detalle-meta-row">
          <dt>Categoría</dt>
          <dd>${producto.categoria}</dd>
        </div>` : ''}
      </dl>

      ${producto.descripcion ? `<p class="detalle-descripcion" itemprop="description">${producto.descripcion}</p>` : ''}

      <div class="detalle-acciones">
        <button class="btn-carrito-detalle" data-codigo="${producto.codigo}" data-nombre="${producto.nombre}">
          🛒 Agregar al pedido
        </button>
        <a href="https://wa.me/${WA_VENTAS}?text=${msgWa}"
           class="btn-wa-detalle" target="_blank" rel="noopener">
          💬 Consultar por WhatsApp
        </a>
      </div>

      <a href="/catalogo" class="detalle-volver">← Volver al catálogo</a>
    </div>

  </div>

</main>

${footerHtml()}
<script src="/carrito.js" defer></script>
<script>
  document.querySelector('.btn-carrito-detalle')?.addEventListener('click', function(){
    var codigo = this.dataset.codigo;
    var nombre = this.dataset.nombre;
    addToCart(codigo, nombre);
  });
</script>
</body></html>`);

  } catch (err) {
    console.error(err);
    res.status(500).send('<h1>Error interno</h1>');
  }
});

// GET /carrito  → Página de carrito
app.get('/carrito', (req, res) => {
  res.send(`${headHtml({ title: 'Tu pedido | BGM Diesel', desc: 'Revisá tu pedido de repuestos y envialo por WhatsApp.' })}
${navHtml('Carrito')}
<div id="notifContainer"></div>

<section class="cat-hero">
  <div class="label">Tu pedido</div>
  <h1>Revisá tu <em>pedido</em></h1>
</section>

<main class="carrito-container" id="carritoMain">
  <div class="cart-empty" id="cartEmpty">
    <p>Tu pedido está vacío.</p>
    <a href="/catalogo" class="btn-primary">Ver catálogo</a>
  </div>
  <div id="cartItems" class="cart-items" style="display:none"></div>
  <div class="cart-actions" id="cartActions" style="display:none">
    <button id="clearCart" class="btn-limpiar-cart">🗑 Vaciar pedido</button>
    <button id="sendWhatsapp" class="btn-wa-detalle">💬 Enviar pedido por WhatsApp</button>
  </div>
</main>

${footerHtml()}
<script src="/carrito.js" defer></script>
<script src="/carrito-page.js" defer></script>
</body></html>`);
});

// ═══════════════════════════════════════════════════════════════════════════════
// API JSON
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/productos', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 24;
    const q     = (req.query.q || '').trim();
    const marca = (req.query.marca || '').trim();

    const filtro = {};
    if (q) filtro.$or = [
      { codigo:  { $regex: q, $options: 'i' } },
      { nombre:  { $regex: q, $options: 'i' } },
    ];
    if (marca) filtro.marca = { $regex: marca, $options: 'i' };

    const [total, productos] = await Promise.all([
      Producto.countDocuments(filtro),
      Producto.find(filtro, 'codigo codigo_proveedor nombre marca imagen')
        .skip((page - 1) * limit).limit(limit).lean(),
    ]);

    res.json({ productos, total, pagina: page, totalPaginas: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/productos/:codigo', async (req, res) => {
  try {
    const p = await Producto.findOne({ codigo: req.params.codigo }).lean();
    if (!p) return res.status(404).json({ error: 'No encontrado' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀 BGM Diesel corriendo en http://localhost:${PORT}`));
