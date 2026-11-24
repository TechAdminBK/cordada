// GENERADO por scripts/generar-landing.mjs desde design/cordada-landing.html. No editar a mano:
// para cambiar el marcado se cambia el diseño (o el script) y se vuelve a generar.
import { Fragment, type CSSProperties } from 'react';
import type { Vista } from '../datos';

// Los estilos son los inline del diseño, tal cual; algunas propiedades (font-stretch, text-wrap)
// no están en los tipos de React, por eso pasan por este molde.
const css = (o: Record<string, string>) => o as CSSProperties;

export function Landing({ accent, brief, onBrief, chips, route, gate, pieces, stats, rules }: Vista) {
  return (
      <div style={css({ minHeight: "100vh", background: "#FFFFFF", color: "#0F1020", fontFamily: "'Archivo', system-ui, sans-serif", fontSize: "16px", lineHeight: "1.6", WebkitFontSmoothing: "antialiased", overflowX: "hidden" })}>
        {" "}
        {" "}
        <header style={css({ position: "sticky", top: "0", zIndex: "10", background: "rgba(255,255,255,.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ECECE8" })}>
          {" "}
          <nav aria-label="Principal" style={css({ maxWidth: "1240px", margin: "0 auto", padding: "14px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" })}>
            {" "}
            <a href="#inicio" style={css({ display: "flex", alignItems: "center", gap: "10px", color: "#0F1020", textDecoration: "none" })}>
              {" "}
              <span aria-hidden="true" style={css({ display: "flex", gap: "3px" })}>
                {" "}
                <span style={css({ width: "9px", height: "22px", borderRadius: "9px", background: "#B4CC3A" })}>
                </span>
                {" "}
                <span style={css({ width: "9px", height: "22px", borderRadius: "9px", background: "#4A2FBD" })}>
                </span>
                {" "}
                <span style={css({ width: "9px", height: "22px", borderRadius: "9px", background: "#3F7BEA" })}>
                </span>
                {" "}
              </span>
              {" "}
              <span style={css({ fontWeight: "800", fontStretch: "125%", fontSize: "19px", letterSpacing: "-.01em" })}>
                {"CORDADA"}
              </span>
              {" "}
            </a>
            {" "}
            <div style={css({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 26px", fontSize: "14px", fontWeight: "500" })}>
              {" "}
              <a href="#compuerta" style={css({ color: "#4A4A46", textDecoration: "none" })}>
                {"Compuerta"}
              </a>
              {" "}
              <a href="#piezas" style={css({ color: "#4A4A46", textDecoration: "none" })}>
                {"Cómo funciona"}
              </a>
              {" "}
              <a href="#numeros" style={css({ color: "#4A4A46", textDecoration: "none" })}>
                {"Números"}
              </a>
              {" "}
              <a href="#reglas" style={css({ color: "#4A4A46", textDecoration: "none" })}>
                {"Reglas"}
              </a>
              {" "}
              <a href="https://breakpoint.biz" style={css({ color: "#4A4A46", textDecoration: "none" })}>
                {"Volver a Break Point"}
              </a>
              {" "}
              <a href="#empezar" className="cd-btn" style={css({ background: "#0F1020", color: "#FFFFFF", fontWeight: "700", padding: "11px 18px", borderRadius: "999px", textDecoration: "none", minHeight: "44px", boxSizing: "border-box", display: "inline-flex", alignItems: "center", gap: "8px" })}>
                {"Empezar un proyecto "}
                <span aria-hidden="true" style={css({ width: "8px", height: "8px", borderRadius: "50%", background: "#B4CC3A" })}>
                </span>
              </a>
              {" "}
            </div>
            {" "}
          </nav>
          {" "}
        </header>
        <main>
          {" "}
          {" "}
          <section id="inicio" style={css({ position: "relative", overflow: "hidden", borderBottom: "1px solid #ECECE8" })}>
            {" "}
            <div aria-hidden="true" className="cd-float" style={css({ position: "absolute", right: "-90px", top: "40px", width: "300px", height: "300px", borderRadius: "50%", background: "#4A2FBD" })}>
            </div>
            {" "}
            <div aria-hidden="true" className="cd-float2" style={css({ position: "absolute", right: "230px", top: "-70px", width: "150px", height: "150px", borderRadius: "40px", background: "#3F7BEA" })}>
            </div>
            {" "}
            <div aria-hidden="true" className="cd-float2" style={css({ position: "absolute", left: "-60px", bottom: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "#EDEAFB" })}>
            </div>
            {" "}
            <div aria-hidden="true" className="cd-spin" style={css({ position: "absolute", left: "44%", bottom: "48px", width: "40px", height: "40px", borderRadius: "10px", background: "#B4CC3A" })}>
            </div>
            {" "}
            <div style={css({ position: "relative", maxWidth: "1240px", margin: "0 auto", padding: "88px 24px 104px", display: "flex", flexWrap: "wrap", gap: "56px", alignItems: "flex-start" })}>
              {" "}
              <div className="cd-rise" style={css({ flex: "999 1 560px", minWidth: "0" })}>
                {" "}
                <p style={css({ margin: "0 0 28px", display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: "500", letterSpacing: ".14em", textTransform: "uppercase", color: "#0F1020", background: "#F3F3EF", borderRadius: "999px", padding: "8px 14px" })}>
                  {" "}
                  <span className="cd-pulse" style={css({ width: "8px", height: "8px", borderRadius: "50%", background: "#4A2FBD", display: "inline-block" })}>
                  </span>
                  {" Desarrollo con agentes · control de entrega "}
                </p>
                {" "}
                <h1 style={css({ margin: "0", fontWeight: "800", fontStretch: "125%", fontSize: "clamp(42px, 6.4vw, 92px)", lineHeight: ".98", letterSpacing: "-.035em", textWrap: "balance" })}>
                  {"Tu agente entregó más código del que "}
                  <span style={css({ color: "#4A2FBD", textDecoration: "underline", textDecorationColor: accent, textDecorationThickness: ".12em", textUnderlineOffset: ".12em" })}>
                    {"podés revisar."}
                  </span>
                </h1>
                {" "}
                <p style={css({ margin: "30px 0 0", maxWidth: "58ch", fontSize: "20px", lineHeight: "1.55", color: "#4A4A46" })}>
                  {"Cordada no hace al agente más inteligente. Le saca la opción de entregar algo que nadie controló, y convierte «me parece que está bien» en "}
                  <b style={css({ color: "#0F1020", fontWeight: "700" })}>
                    {"pasa o no pasa"}
                  </b>
                  {"."}
                </p>
                {" "}
                {" "}
                <form style={css({ marginTop: "44px", background: "#FFFFFF", border: "2px solid #0F1020", borderRadius: "20px", padding: "20px", boxShadow: "8px 8px 0 #4A2FBD" })}>
                  {" "}
                  <label htmlFor="cd-brief" style={css({ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: "500", letterSpacing: ".12em", textTransform: "uppercase", color: "#5C5C57", marginBottom: "10px" })}>
                    {" "}
                    <span style={css({ color: "#4A2FBD" })}>
                      {"›"}
                    </span>
                    {" Contanos qué cuenta como terminado"}
                    <span className="cd-cursor" style={css({ display: "inline-block", width: "8px", height: "14px", background: "#4A2FBD" })}>
                    </span>
                    {" "}
                  </label>
                  {" "}
                  <textarea id="cd-brief" rows={3} value={brief} onChange={onBrief} placeholder="Pegá el brief, el PR o la spec. Escribimos los criterios antes de que el agente toque un archivo." style={css({ width: "100%", boxSizing: "border-box", resize: "vertical", background: "transparent", border: "0", color: "#0F1020", fontFamily: "'Archivo', system-ui, sans-serif", fontSize: "18px", lineHeight: "1.5", padding: "4px 0", outline: "none" })}>
                  </textarea>
                  {" "}
                  <div style={css({ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "14px", marginTop: "14px", paddingTop: "16px", borderTop: "1px solid #ECECE8" })}>
                    {" "}
                    <div style={css({ display: "flex", flexWrap: "wrap", gap: "8px" })}>
                      {" "}
                      {chips.map((chip, i) => (<Fragment key={i}>
                        {" "}
                        {chip.on && (<>
                          {" "}
                          <button type="button" onClick={chip.pick} aria-pressed="true" style={css({ minHeight: "40px", padding: "8px 14px", borderRadius: "999px", border: "2px solid #0F1020", background: chip.color, color: "#0F1020", fontFamily: "'Archivo', system-ui, sans-serif", fontSize: "14px", fontWeight: "600", cursor: "pointer" })}>
                            {chip.label}
                          </button>
                          {" "}
                        </>)}
                        {" "}
                        {chip.off && (<>
                          {" "}
                          <button type="button" className="cd-chip" onClick={chip.pick} aria-pressed="false" style={css({ minHeight: "40px", padding: "8px 14px", borderRadius: "999px", border: "2px solid #DADAD4", background: "#FFFFFF", color: "#4A4A46", fontFamily: "'Archivo', system-ui, sans-serif", fontSize: "14px", fontWeight: "500", cursor: "pointer" })}>
                            {chip.label}
                          </button>
                          {" "}
                        </>)}
                        {" "}
                      </Fragment>))}
                      {" "}
                    </div>
                    {" "}
                    <a href="#empezar" className="cd-btn" style={css({ background: "#0F1020", color: "#FFFFFF", fontWeight: "700", fontSize: "15px", padding: "12px 22px", borderRadius: "12px", textDecoration: "none", minHeight: "46px", boxSizing: "border-box", display: "inline-flex", alignItems: "center", gap: "8px" })}>
                      {"Armar el contrato "}
                      <span aria-hidden="true" style={css({ color: "#B4CC3A" })}>
                        {"→"}
                      </span>
                    </a>
                    {" "}
                  </div>
                  {" "}
                </form>
                {" "}
              </div>
              {" "}
              {" "}
              <aside aria-label="Ruta de una entrega" className="cd-rise" style={css({ flex: "1 1 360px", minWidth: "0", background: "#0F1020", color: "#FFFFFF", borderRadius: "24px", padding: "26px 26px 12px", boxShadow: "0 30px 60px -30px rgba(17,17,17,.5)" })}>
                {" "}
                <div style={css({ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", marginBottom: "24px", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase" })}>
                  {" "}
                  <span style={css({ color: "#A6A6A0" })}>
                    {"Ruta de entrega"}
                  </span>
                  {" "}
                  <span style={css({ color: "#B4CC3A" })}>
                    {"● corrida real"}
                  </span>
                  {" "}
                </div>
                {" "}
                <div style={css({ position: "relative" })}>
                  {" "}
                  <div className="cd-rope" aria-hidden="true" style={css({ position: "absolute", left: "8px", top: "8px", bottom: "26px", width: "2px", background: "#3A3A36" })}>
                  </div>
                  {" "}
                  <div style={css({ display: "flex", flexDirection: "column", gap: "22px" })}>
                    {" "}
                    {route.map((step, i) => (<Fragment key={i}>
                      {" "}
                      <div style={css({ display: "flex", gap: "18px", alignItems: "flex-start", position: "relative" })}>
                        {" "}
                        <span aria-hidden="true" style={css({ flex: "none", width: "18px", height: "18px", borderRadius: "50%", background: step.color, marginTop: "3px" })}>
                        </span>
                        {" "}
                        <div style={css({ flex: "1", minWidth: "0" })}>
                          {" "}
                          <div style={css({ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "baseline" })}>
                            {" "}
                            <span style={css({ fontWeight: "700", fontStretch: "110%", fontSize: "16px" })}>
                              {step.name}
                            </span>
                            {" "}
                            <span style={css({ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: step.color, whiteSpace: "nowrap" })}>
                              {step.verdict}
                            </span>
                            {" "}
                          </div>
                          {" "}
                          <p style={css({ margin: "2px 0 0", fontSize: "14px", color: "#A6A6A0" })}>
                            {step.detail}
                          </p>
                          {" "}
                        </div>
                        {" "}
                      </div>
                      {" "}
                    </Fragment>))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <p style={css({ margin: "22px -26px 0", padding: "14px 26px", borderTop: "1px solid #2A2A27", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#A6A6A0" })}>
                  {"commit 29be33c · 30-oct-2026"}
                </p>
                {" "}
              </aside>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {" "}
          <div aria-label="Funciona con cualquier stack" style={css({ overflow: "hidden", padding: "22px 0", background: "#0F1020" })}>
            {" "}
            <div className="cd-track" style={css({ display: "flex", width: "max-content", gap: "40px", fontWeight: "800", fontStretch: "125%", fontSize: "24px", letterSpacing: "-.01em", color: "#FFFFFF", whiteSpace: "nowrap", alignItems: "center" })}>
              {" "}
              <span>
                {"Cualquier modelo"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#B4CC3A" })}>
              </span>
              <span>
                {"Cualquier orquestador"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#3F7BEA" })}>
              </span>
              <span>
                {"Código"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#EDEAFB" })}>
              </span>
              <span>
                {"Documentos"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#3F7BEA" })}>
              </span>
              <span>
                {"Multi-agente"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#9C8CEB" })}>
              </span>
              <span>
                {"Git & CI"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#B4CC3A" })}>
              </span>
              <span>
                {"Specs"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#3F7BEA" })}>
              </span>
              <span>
                {"Auditorías"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#EDEAFB" })}>
              </span>
              {" "}
              <span aria-hidden="true">
                {"Cualquier modelo"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#B4CC3A" })}>
              </span>
              <span aria-hidden="true">
                {"Cualquier orquestador"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#3F7BEA" })}>
              </span>
              <span aria-hidden="true">
                {"Código"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#EDEAFB" })}>
              </span>
              <span aria-hidden="true">
                {"Documentos"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#3F7BEA" })}>
              </span>
              <span aria-hidden="true">
                {"Multi-agente"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#9C8CEB" })}>
              </span>
              <span aria-hidden="true">
                {"Git & CI"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#B4CC3A" })}>
              </span>
              <span aria-hidden="true">
                {"Specs"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#3F7BEA" })}>
              </span>
              <span aria-hidden="true">
                {"Auditorías"}
              </span>
              <span aria-hidden="true" style={css({ width: "14px", height: "14px", borderRadius: "50%", background: "#EDEAFB" })}>
              </span>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          {" "}
          <section style={css({ borderBottom: "1px solid #ECECE8" })}>
            {" "}
            <div style={css({ maxWidth: "1240px", margin: "0 auto", padding: "110px 24px", display: "flex", flexWrap: "wrap", gap: "40px 64px", alignItems: "center" })}>
              {" "}
              <div style={css({ flex: "0 1 auto", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "clamp(220px, 26vw, 340px)", aspectRatio: "1", borderRadius: "50%", background: "#4A2FBD" })}>
                {" "}
                <p style={css({ margin: "0", fontWeight: "900", fontStretch: "125%", fontSize: "clamp(110px, 14vw, 190px)", lineHeight: ".8", letterSpacing: "-.06em", color: "#B4CC3A" })}>
                  {"21"}
                </p>
                {" "}
              </div>
              {" "}
              <div style={css({ flex: "1 1 420px", minWidth: "0" })}>
                {" "}
                <p style={css({ margin: "0", fontWeight: "700", fontStretch: "110%", fontSize: "clamp(26px, 3.2vw, 40px)", lineHeight: "1.15", letterSpacing: "-.02em", textWrap: "balance" })}>
                  {"hallazgos verificados en un documento que ya tenía el visto bueno del revisor y cinco rondas de corrección encima."}
                </p>
                {" "}
                <p style={css({ margin: "20px 0 0", maxWidth: "60ch", color: "#4A4A46" })}>
                  {"Dos de esas cifras eran lógicamente imposibles entre sí y habían sobrevivido a una auditoría de 58 números. Una sola sesión."}
                </p>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {" "}
          <section id="compuerta" style={css({ borderBottom: "1px solid #ECECE8", background: "#F6F5FC" })}>
            {" "}
            <div style={css({ maxWidth: "1240px", margin: "0 auto", padding: "110px 24px" })}>
              {" "}
              <p style={css({ margin: "0 0 18px", display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: "700", letterSpacing: ".14em", textTransform: "uppercase", color: "#4A2FBD", background: "#EDEAFB", borderRadius: "999px", padding: "6px 12px" })}>
                {"01 — La compuerta"}
              </p>
              {" "}
              <h2 style={css({ margin: "0", maxWidth: "18ch", fontWeight: "800", fontStretch: "125%", fontSize: "clamp(34px, 4.6vw, 64px)", lineHeight: "1.02", letterSpacing: "-.03em" })}>
                {"Un lote se aplica entero o no se aplica."}
              </h2>
              {" "}
              <p style={css({ margin: "22px 0 48px", maxWidth: "62ch", fontSize: "18px", color: "#4A4A46" })}>
                {"Cuatro eventos reales. Ninguno es una simulación: dos entregas fueron rechazadas por la propia compuerta antes de tocar un archivo."}
              </p>
              {" "}
              <div style={css({ background: "#0F1020", borderRadius: "20px", overflow: "hidden", fontFamily: "'JetBrains Mono', monospace", boxShadow: "10px 10px 0 #4A2FBD" })}>
                {" "}
                <div style={css({ display: "flex", alignItems: "center", gap: "8px", padding: "14px 20px", borderBottom: "1px solid #2A2A27" })}>
                  {" "}
                  <span aria-hidden="true" style={css({ width: "11px", height: "11px", borderRadius: "50%", background: "#3F7BEA" })}>
                  </span>
                  {" "}
                  <span aria-hidden="true" style={css({ width: "11px", height: "11px", borderRadius: "50%", background: "#3F7BEA" })}>
                  </span>
                  {" "}
                  <span aria-hidden="true" style={css({ width: "11px", height: "11px", borderRadius: "50%", background: "#B4CC3A" })}>
                  </span>
                  {" "}
                  <span style={css({ marginLeft: "10px", fontSize: "12px", color: "#A6A6A0" })}>
                    {"cordada gate --log · 30-oct-2026"}
                  </span>
                  {" "}
                </div>
                {" "}
                {gate.map((g, i) => (<Fragment key={i}>
                  {" "}
                  <div style={css({ display: "flex", flexWrap: "wrap", gap: "8px 20px", alignItems: "baseline", padding: "20px", borderBottom: "1px solid #222220" })}>
                    {" "}
                    <span style={css({ flex: "none", width: "28px", fontSize: "13px", color: "#75756F" })}>
                      {g.n}
                    </span>
                    {" "}
                    <span style={css({ flex: "1 1 300px", minWidth: "0", fontFamily: "'Archivo', system-ui, sans-serif", fontSize: "17px", color: "#FFFFFF" })}>
                      {g.what}
                    </span>
                    {" "}
                    <span style={css({ flex: "none", fontSize: "12px", fontWeight: "700", letterSpacing: ".12em", padding: "6px 11px", borderRadius: "999px", color: "#0F1020", background: g.color })}>
                      {g.verdict}
                    </span>
                    {" "}
                    <span style={css({ flex: "1 1 100%", paddingLeft: "48px", boxSizing: "border-box", fontSize: "13px", lineHeight: "1.6", color: "#A6A6A0" })}>
                      {g.why}
                    </span>
                    {" "}
                  </div>
                  {" "}
                </Fragment>))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {" "}
          <section id="piezas" style={css({ borderBottom: "1px solid #ECECE8" })}>
            {" "}
            <div style={css({ maxWidth: "1240px", margin: "0 auto", padding: "110px 24px" })}>
              {" "}
              <p style={css({ margin: "0 0 18px", display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: "700", letterSpacing: ".14em", textTransform: "uppercase", color: "#4A2FBD", background: "#EDEAFB", borderRadius: "999px", padding: "6px 12px" })}>
                {"02 — El producto"}
              </p>
              {" "}
              <h2 style={css({ margin: "0", maxWidth: "20ch", fontWeight: "800", fontStretch: "125%", fontSize: "clamp(34px, 4.6vw, 64px)", lineHeight: "1.02", letterSpacing: "-.03em" })}>
                {"Cuatro piezas. Cada una contesta una pregunta."}
              </h2>
              {" "}
              <p style={css({ margin: "22px 0 56px", maxWidth: "62ch", fontSize: "18px", color: "#4A4A46" })}>
                {"Vale para código y para agentes. No depende de qué modelo escriba, ni de qué framework orqueste."}
              </p>
              {" "}
              <div style={css({ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))", gap: "20px" })}>
                {" "}
                {pieces.map((p, i) => (<Fragment key={i}>
                  {" "}
                  <article className="cd-card" style={css({ position: "relative", background: p.bg, color: p.fg, border: "2px solid #0F1020", borderRadius: "24px", padding: "36px", minWidth: "0", overflow: "hidden" })}>
                    {" "}
                    <span aria-hidden="true" style={css({ position: "absolute", right: "22px", top: "-8px", fontWeight: "900", fontStretch: "125%", fontSize: "150px", lineHeight: "1", letterSpacing: "-.05em", opacity: ".16" })}>
                      {p.n}
                    </span>
                    {" "}
                    <p style={css({ position: "relative", margin: "0 0 18px", display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: "500", background: "rgba(255,255,255,.85)", color: "#0F1020", borderRadius: "999px", padding: "5px 12px" })}>
                      {p.q}
                    </p>
                    {" "}
                    <h3 style={css({ position: "relative", margin: "0", fontWeight: "800", fontStretch: "115%", fontSize: "32px", lineHeight: "1.08", letterSpacing: "-.02em" })}>
                      {p.title}
                    </h3>
                    {" "}
                    <p style={css({ position: "relative", margin: "16px 0 0", fontSize: "16px", lineHeight: "1.65", fontWeight: "500" })}>
                      {p.body}
                    </p>
                    {" "}
                  </article>
                  {" "}
                </Fragment>))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {" "}
          <section id="numeros" style={css({ borderBottom: "1px solid #ECECE8", background: "#F6F5FC" })}>
            {" "}
            <div style={css({ maxWidth: "1240px", margin: "0 auto", padding: "110px 24px" })}>
              {" "}
              <p style={css({ margin: "0 0 18px", display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: "700", letterSpacing: ".14em", textTransform: "uppercase", color: "#4A2FBD", background: "#EDEAFB", borderRadius: "999px", padding: "6px 12px" })}>
                {"03 — El mecanismo, en números"}
              </p>
              {" "}
              <h2 style={css({ margin: "0", maxWidth: "20ch", fontWeight: "800", fontStretch: "125%", fontSize: "clamp(34px, 4.6vw, 64px)", lineHeight: "1.02", letterSpacing: "-.03em" })}>
                {"Todo esto salió de una sola sesión."}
              </h2>
              {" "}
              <p style={css({ margin: "22px 0 56px", maxWidth: "62ch", fontSize: "18px", color: "#4A4A46" })}>
                {"Seis agentes, cinco rondas, cuatro commits y un documento de 64 láminas. Cada número con su origen."}
              </p>
              {" "}
              <div style={css({ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "16px" })}>
                {" "}
                {stats.map((s, i) => (<Fragment key={i}>
                  {" "}
                  <div className="cd-card" style={css({ padding: "32px 30px", borderRadius: "22px", border: "2px solid #0F1020", background: s.bg, color: s.fg, minWidth: "0" })}>
                    {" "}
                    <p style={css({ margin: "0", fontFamily: "'JetBrains Mono', monospace", fontWeight: "700", fontSize: "clamp(40px, 4.4vw, 58px)", lineHeight: "1", letterSpacing: "-.04em", whiteSpace: "nowrap" })}>
                      {s.big}
                    </p>
                    {" "}
                    <p style={css({ margin: "18px 0 0", fontWeight: "800", fontStretch: "110%", fontSize: "19px" })}>
                      {s.what}
                    </p>
                    {" "}
                    <p style={css({ margin: "8px 0 0", fontSize: "14px", lineHeight: "1.6", fontWeight: "500" })}>
                      {s.src}
                    </p>
                    {" "}
                  </div>
                  {" "}
                </Fragment>))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {" "}
          <section id="reglas" style={css({ borderBottom: "1px solid #ECECE8" })}>
            {" "}
            <div style={css({ maxWidth: "1240px", margin: "0 auto", padding: "110px 24px" })}>
              {" "}
              <div style={css({ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", marginBottom: "56px" })}>
                {" "}
                <div style={css({ flex: "1 1 520px", minWidth: "0" })}>
                  {" "}
                  <p style={css({ margin: "0 0 18px", display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: "700", letterSpacing: ".14em", textTransform: "uppercase", color: "#4A2FBD", background: "#EDEAFB", borderRadius: "999px", padding: "6px 12px" })}>
                    {"04 — Reglas con un cadáver atrás"}
                  </p>
                  {" "}
                  <h2 style={css({ margin: "0", maxWidth: "22ch", fontWeight: "800", fontStretch: "125%", fontSize: "clamp(34px, 4.6vw, 64px)", lineHeight: "1.02", letterSpacing: "-.03em" })}>
                    {"Cada regla nació de una falla. Y cada una tiene su equivalente en código."}
                  </h2>
                  {" "}
                </div>
                {" "}
                <p style={css({ flex: "0 1 380px", margin: "0", fontSize: "16px", color: "#4A4A46" })}>
                  {"El código tiene un oráculo que se ejecuta: compilador, tipos, tests. Cordada aporta poco donde el test ya decide, y mucho donde no hay máquina que conteste."}
                </p>
                {" "}
              </div>
              {" "}
              <div style={css({ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))", gap: "16px" })}>
                {" "}
                {rules.map((r, i) => (<Fragment key={i}>
                  {" "}
                  <article className="cd-card" style={css({ display: "flex", flexDirection: "column", gap: "14px", background: "#FFFFFF", border: "2px solid #0F1020", borderRadius: "18px", padding: "24px", minWidth: "0" })}>
                    {" "}
                    <div style={css({ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" })}>
                      {" "}
                      <span style={css({ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#4A2FBD", background: "#EDEAFB", borderRadius: "999px", padding: "5px 10px" })}>
                        {r.tag}
                      </span>
                      {" "}
                      <span aria-hidden="true" style={css({ width: "26px", height: "26px", borderRadius: "8px", background: r.color })}>
                      </span>
                      {" "}
                    </div>
                    {" "}
                    <h3 style={css({ margin: "0", fontWeight: "800", fontStretch: "110%", fontSize: "19px", lineHeight: "1.25" })}>
                      {r.rule}
                    </h3>
                    {" "}
                    <div style={css({ marginTop: "auto", paddingTop: "14px", borderTop: "2px dashed #E2E2DC" })}>
                      {" "}
                      <p style={css({ margin: "0 0 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5C5C57" })}>
                        {"En código"}
                      </p>
                      {" "}
                      <p style={css({ margin: "0", fontSize: "14px", lineHeight: "1.6", color: "#3A3A36" })}>
                        {r.code}
                      </p>
                      {" "}
                    </div>
                    {" "}
                  </article>
                  {" "}
                </Fragment>))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {" "}
          <section style={css({ position: "relative", overflow: "hidden", background: "#EDEAFB", color: "#0F1020" })}>
            {" "}
            <div aria-hidden="true" className="cd-float" style={css({ position: "absolute", right: "6%", top: "50%", marginTop: "-110px", width: "220px", height: "220px", borderRadius: "50%", background: "#4A2FBD" })}>
            </div>
            {" "}
            <div aria-hidden="true" className="cd-float2" style={css({ position: "absolute", right: "18%", bottom: "-50px", width: "110px", height: "110px", borderRadius: "28px", background: "#3F7BEA" })}>
            </div>
            {" "}
            <div aria-hidden="true" className="cd-spin" style={css({ position: "absolute", right: "25%", top: "56px", width: "36px", height: "36px", borderRadius: "9px", background: accent })}>
            </div>
            {" "}
            <div style={css({ position: "relative", maxWidth: "1240px", margin: "0 auto", padding: "104px 24px" })}>
              {" "}
              <p style={css({ margin: "0", maxWidth: "22ch", fontWeight: "900", fontStretch: "125%", fontSize: "clamp(32px, 4.8vw, 68px)", lineHeight: "1.02", letterSpacing: "-.035em", textWrap: "balance" })}>
                {"«Los tests pasan» y «esto funciona» no son la misma afirmación."}
              </p>
              {" "}
              <p style={css({ margin: "28px 0 0", maxWidth: "56ch", fontSize: "18px", fontWeight: "500" })}>
                {"Lo que no se puede mecanizar queda declarado como juicio, con nombre y fecha. Un juicio declarado se puede discutir; uno escondido en un «listo», no."}
              </p>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {" "}
          <section id="empezar" style={css({ background: "#4A2FBD", color: "#FFFFFF", position: "relative", overflow: "hidden" })}>
            {" "}
            <div aria-hidden="true" className="cd-spin" style={css({ position: "absolute", left: "-40px", top: "60px", width: "120px", height: "120px", borderRadius: "30px", background: "#3F7BEA" })}>
            </div>
            {" "}
            <div aria-hidden="true" className="cd-float" style={css({ position: "absolute", right: "-70px", bottom: "-70px", width: "260px", height: "260px", borderRadius: "50%", background: "#0F1020" })}>
            </div>
            {" "}
            <div style={css({ position: "relative", maxWidth: "1240px", margin: "0 auto", padding: "130px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" })}>
              {" "}
              <p style={css({ margin: "0 0 22px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: "500", letterSpacing: ".16em", textTransform: "uppercase", color: "#E4DCFF" })}>
                {"Escribí el criterio primero"}
              </p>
              {" "}
              <h2 style={css({ margin: "0", maxWidth: "16ch", fontWeight: "900", fontStretch: "125%", fontSize: "clamp(40px, 6.6vw, 96px)", lineHeight: ".98", letterSpacing: "-.04em", textWrap: "balance" })}>
                {"Decinos qué es "}
                <span style={css({ color: "#B4CC3A" })}>
                  {"terminado."}
                </span>
                {" La compuerta hace el resto."}
              </h2>
              {" "}
              <div style={css({ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "44px" })}>
                {" "}
                <a href="https://www.breakpoint.biz/#empecemos" className="cd-btn" style={css({ background: "#B4CC3A", color: "#0F1020", fontWeight: "800", fontSize: "17px", padding: "16px 28px", borderRadius: "14px", border: "2px solid #0F1020", textDecoration: "none", minHeight: "52px", boxSizing: "border-box", display: "inline-flex", alignItems: "center", gap: "10px" })}>
                  {"Empezar un proyecto "}
                  <span aria-hidden="true">
                    {"→"}
                  </span>
                </a>
                {" "}
                <a href="#compuerta" style={css({ color: "#FFFFFF", fontWeight: "600", fontSize: "17px", padding: "16px 28px", borderRadius: "14px", border: "2px solid rgba(255,255,255,.6)", textDecoration: "none", minHeight: "52px", boxSizing: "border-box", display: "inline-flex", alignItems: "center" })}>
                  {"Ver la compuerta"}
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {" "}
        </main>
        <footer style={css({ background: "#FFFFFF" })}>
          {" "}
          <div style={css({ maxWidth: "1240px", margin: "0 auto", padding: "40px 24px 56px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", fontSize: "14px", color: "#5C5C57" })}>
            {" "}
            <span style={css({ display: "flex", alignItems: "center", gap: "10px" })}>
              {" "}
              <span aria-hidden="true" style={css({ display: "flex", gap: "3px" })}>
                {" "}
                <span style={css({ width: "7px", height: "18px", borderRadius: "7px", background: "#B4CC3A" })}>
                </span>
                {" "}
                <span style={css({ width: "7px", height: "18px", borderRadius: "7px", background: "#4A2FBD" })}>
                </span>
                {" "}
                <span style={css({ width: "7px", height: "18px", borderRadius: "7px", background: "#3F7BEA" })}>
                </span>
                {" "}
              </span>
              {" "}
              <span style={css({ fontWeight: "800", fontStretch: "125%", color: "#0F1020" })}>
                {"CORDADA"}
              </span>
              {" "}
            </span>
            {" "}
            <span style={css({ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" })}>
              {"Cada número de esta página sale del registro de una sesión real · commit 29be33c"}
            </span>
            {" "}
            <span>
              {"© 2026 Cordada"}
            </span>
            {" "}
            <a href="https://breakpoint.biz" style={css({ color: "#0F1020", fontWeight: "600", textDecoration: "none" })}>
              {"Volver a Break Point"}
            </a>
            {" "}
          </div>
          {" "}
        </footer>
        {" "}
      </div>
  );
}
