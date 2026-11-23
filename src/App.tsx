import { useState } from 'react';
import {
  colores,
  compuerta,
  cierre,
  hero,
  navIds,
  nav,
  numeros,
  piezas,
  reglas,
  breakpoint,
} from './content';

type Fondo = 'violeta' | 'azul' | 'suave' | 'tinta' | 'blanco';
type Texto = 'blanco' | 'tinta';

const fondo = (f: Fondo) => colores[f];
const texto = (t: Texto) => colores[t];

function Logo() {
  return <span className="logo">CORDADA</span>;
}

function Header() {
  return (
    <header className="header">
      <nav className="header__nav" aria-label="Principal">
        <a href="#top" className="header__logo" aria-label="Cordada">
          <Logo />
        </a>
        <div className="header__links">
          {nav.map((label, i) => (
            <a key={label} href={`#${navIds[i]}`} className="header__link">
              {label}
            </a>
          ))}
        </div>
        <a href={breakpoint.url} className="header__back">
          {breakpoint.texto} <span aria-hidden="true">←</span>
        </a>
        <a href="#empezar" className="btn btn--ink">
          {hero.cta}
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__inner">
        <p className="kicker">{hero.kicker}</p>
        <h1 className="hero__h1">{hero.h1}</h1>
        <p className="hero__lede">{hero.lede}</p>
        <a href="#empezar" className="btn btn--violet">
          {hero.cta}
        </a>
        <ul className="tags" aria-label="Qué cubre">
          {hero.tags.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Compuerta() {
  const [chip, setChip] = useState(-1);
  const [brief, setBrief] = useState('');

  return (
    <section id="compuerta" className="section section--lilac">
      <div className="section__inner">
        <p className="kicker">{compuerta.kicker}</p>
        <h2 className="h2">{compuerta.titulo}</h2>
        <p className="lede">{compuerta.bajada}</p>

        <div className="brief">
          <label htmlFor="brief" className="brief__label">
            {compuerta.pregunta}
          </label>
          <div className="chips">
            {compuerta.chips.map((c, i) => (
              <button
                key={c.label}
                type="button"
                className={`chip${chip === i ? ' chip--on' : ''}`}
                aria-pressed={chip === i}
                onClick={() => {
                  setChip(i);
                  setBrief(c.texto);
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <textarea
            id="brief"
            className="brief__input"
            rows={3}
            value={brief}
            onChange={(e) => {
              setBrief(e.target.value);
              setChip(-1);
            }}
          />
          <a href="#empezar" className="btn btn--violet">
            {compuerta.cta}
          </a>
        </div>

        <div className="ruta" aria-label="Ruta de entrega">
          <div className="ruta__head">
            <span className="ruta__live">● corrida real</span>
            <span className="mono">{compuerta.ruta_sello}</span>
          </div>
          <ol className="ruta__steps">
            {compuerta.ruta.map((s) => (
              <li key={s.nombre} className="ruta__step">
                <span className="ruta__name">{s.nombre}</span>
                <span className="ruta__verdict">{s.veredicto}</span>
                <span className="ruta__detail">{s.detalle}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="log" aria-label={compuerta.log}>
          <div className="log__head mono">{compuerta.log}</div>
          {compuerta.eventos.map((e) => (
            <div key={e.n} className="log__row">
              <span className="mono">{e.n}</span>
              <span className="log__que">{e.que}</span>
              <span className={`log__veredicto log__veredicto--${e.veredicto === 'APLICADO' ? 'ok' : 'no'}`}>
                {e.veredicto}
              </span>
              <span className="log__por">{e.por}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Piezas() {
  return (
    <section id="piezas" className="section">
      <div className="section__inner">
        <p className="kicker">{piezas.kicker}</p>
        <h2 className="h2">{piezas.titulo}</h2>
        <p className="lede">{piezas.bajada}</p>
        <div className="piezas">
          {piezas.items.map((p) => (
            <article key={p.n} className="pieza" style={{ background: fondo(p.fondo), color: texto(p.texto) }}>
              <span className="mono">{p.n}</span>
              <p className="pieza__q">{p.q}</p>
              <h3 className="pieza__titulo">{p.titulo}</h3>
              <p className="pieza__cuerpo">{p.cuerpo}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Numeros() {
  return (
    <section id="numeros" className="section section--lilac">
      <div className="section__inner">
        <p className="kicker">{numeros.kicker}</p>
        <h2 className="h2">{numeros.titulo}</h2>
        <p className="lede">{numeros.bajada}</p>
        <div className="numeros">
          {numeros.items.map((n) => (
            <article key={n.grande} className="numero" style={{ background: fondo(n.fondo), color: texto(n.texto) }}>
              <p className="numero__grande">{n.grande}</p>
              <p className="numero__que">{n.que}</p>
              <p className="numero__fuente">{n.fuente}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reglas() {
  return (
    <section id="reglas" className="section">
      <div className="section__inner">
        <p className="kicker">{reglas.kicker}</p>
        <h2 className="h2">{reglas.titulo}</h2>
        <p className="lede">{reglas.bajada}</p>
        <ul className="reglas">
          {reglas.items.map((r) => (
            <li key={r.tag} className="regla">
              <span className="regla__tag" style={{ background: colores[r.color] }}>
                {r.tag}
              </span>
              <p className="regla__rule">{r.regla}</p>
              <p className="regla__code">
                <span className="mono">En código</span>
                {r.codigo}
              </p>
            </li>
          ))}
        </ul>
        <p className="nota">{reglas.nota}</p>
        <p className="nota nota--muted">{reglas.nota2}</p>
      </div>
    </section>
  );
}

function Cierre() {
  return (
    <section id="empezar" className="cierre">
      <div className="section__inner">
        <p className="kicker kicker--light">{cierre.kicker}</p>
        <h2 className="cierre__h2">{cierre.titulo}</h2>
        <p className="cierre__bajada">{cierre.bajada}</p>
        <div className="cierre__actions">
          <a href="#empezar" className="btn btn--lime">
            {cierre.cta}
          </a>
          <a href="#compuerta" className="btn btn--ghost">
            {cierre.ver}
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <Logo />
        <p className="mono">{cierre.pie}</p>
        <p>{cierre.copyright}</p>
        <a href={breakpoint.url} className="footer__back">{breakpoint.texto}</a>
      </div>
    </footer>
  );
}

export function App() {
  return (
    <div id="top" style={{ background: colores.blanco, color: colores.tinta }}>
      <Header />
      <main>
        <Hero />
        <Compuerta />
        <Piezas />
        <Numeros />
        <Reglas />
        <Cierre />
      </main>
      <Footer />
    </div>
  );
}
