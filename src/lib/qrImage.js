import QRCode from 'qrcode'

const TAMANO_QR = 480
const PADDING = 48
const ALTO_TEXTO = 56

// Compone el QR con textos opcionales arriba/abajo sobre un canvas. Devuelve
// el canvas ya dibujado, listo para leer con toDataURL o para incrustar en
// la vista previa.
export async function dibujarQrComposicion(canvas, { url, colorFondo, colorFigura, textoSuperior, textoInferior }) {
  const qrCanvas = document.createElement('canvas')
  await QRCode.toCanvas(qrCanvas, url, {
    width: TAMANO_QR,
    margin: 1,
    color: { dark: colorFigura, light: colorFondo },
  })

  const alturaSuperior = textoSuperior ? ALTO_TEXTO : 0
  const alturaInferior = textoInferior ? ALTO_TEXTO : 0
  const ancho = TAMANO_QR + PADDING * 2
  const alto = TAMANO_QR + PADDING * 2 + alturaSuperior + alturaInferior

  canvas.width = ancho
  canvas.height = alto
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = colorFondo
  ctx.fillRect(0, 0, ancho, alto)

  ctx.fillStyle = colorFigura
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (textoSuperior) {
    ctx.font = '600 26px "Space Grotesk", Inter, sans-serif'
    ctx.fillText(textoSuperior, ancho / 2, PADDING / 2 + alturaSuperior / 2, ancho - PADDING)
  }

  ctx.drawImage(qrCanvas, PADDING, alturaSuperior + PADDING)

  if (textoInferior) {
    ctx.font = '400 18px Inter, sans-serif'
    ctx.fillText(textoInferior, ancho / 2, alturaSuperior + PADDING * 1.5 + TAMANO_QR, ancho - PADDING)
  }

  return canvas
}

// Contraste aproximado (luminancia relativa) entre dos colores hex, para
// avisar si la combinación elegida puede volver el QR ilegible al escanear.
export function contrasteBajo(colorFondo, colorFigura) {
  const luminancia = (hex) => {
    const n = parseInt(hex.replace('#', ''), 16)
    if (Number.isNaN(n)) return 1
    const r = (n >> 16) & 255
    const g = (n >> 8) & 255
    const b = n & 255
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  return Math.abs(luminancia(colorFondo) - luminancia(colorFigura)) < 80
}
