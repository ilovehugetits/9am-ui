// Uygulama geneli smooth wheel scroll. İki işi birden çözer:
//
// 1. FiveM CEF (Chromium 103) compositor'ı bazı scroller'ları (özellikle
//    clip-path'li olanları) wheel ile kaydırmıyor — event sayfaya ulaşıyor ama
//    scroll işlenmiyor. Wheel'i yakalayıp scroll'u kendimiz süreriz.
// 2. Her scroller'da tutarlı rAF lerp'li yumuşak kaydırma — Chrome'da da
//    FiveM'de de birebir aynı his (native scroll tamamen devre dışı).
//
// Kurulum: main.tsx'te bir kez installSmoothScroll().

type Axis = "y" | "x"

interface Anim {
  target: number
  current: number
  raf: number
  axis: Axis
}

// eleman başına tek animasyon; unmount olursa WeakMap kendini temizler
const anims = new WeakMap<HTMLElement, Anim>()

const getMax = (el: HTMLElement, axis: Axis) =>
  axis === "y"
    ? el.scrollHeight - el.clientHeight
    : el.scrollWidth - el.clientWidth

const getPos = (el: HTMLElement, axis: Axis) =>
  axis === "y" ? el.scrollTop : el.scrollLeft

const setPos = (el: HTMLElement, axis: Axis, v: number) => {
  if (axis === "y") el.scrollTop = v
  else el.scrollLeft = v
}

// delta yönünde hâlâ yol var mı? animasyon sürüyorsa karar hedefe göre —
// iç scroller dibe varınca sonraki tick doğal olarak dıştakine zincirlenir
function canScroll(el: HTMLElement, axis: Axis, delta: number) {
  // getComputedStyle olağan durumda atmaz, ama disconnected/exotic elemanlarda
  // (ör. bazı SVG/shadow DOM kenar durumları) sürprizlere karşı savunmacı ol
  let overflow: string
  try {
    const style = getComputedStyle(el)
    overflow = axis === "y" ? style.overflowY : style.overflowX
  } catch {
    return false
  }
  // "overlay" eski WebKit/Blink'te "auto" gibi davranan ayrı bir overflow değeri
  if (overflow !== "auto" && overflow !== "scroll" && overflow !== "overlay") return false
  const max = getMax(el, axis)
  if (max <= 0) return false
  const anim = anims.get(el)
  const pos = anim && anim.axis === axis ? anim.target : getPos(el, axis)
  return delta > 0 ? pos < max - 0.5 : pos > 0.5
}

// shadow root sınırında parentElement null döner — host'tan devam et ki arama
// bir web component içinde sessizce ölmesin
function parentOrHost(el: Element): Element | null {
  if (el.parentElement) return el.parentElement
  const root = el.getRootNode()
  return root instanceof ShadowRoot ? root.host : null
}

// wheel hedefinden yukarı yürüyüp delta yönünde kaydırılabilen ilk eleman
function findScroller(start: EventTarget | null, axis: Axis, delta: number) {
  let el = start instanceof Element ? start : null
  for (; el; el = parentOrHost(el)) {
    // SVGElement gibi HTMLElement olmayanlar canScroll'a hiç girmez, atmaz
    if (el instanceof HTMLElement && canScroll(el, axis, delta)) return el
  }
  return null
}

function startAnim(el: HTMLElement) {
  const step = () => {
    const anim = anims.get(el)
    if (!anim) return
    // dışarıdan scroll yazıldıysa (ör. Viewport thumb drag) animasyonu bırak
    if (Math.abs(getPos(el, anim.axis) - anim.current) > 2) {
      anims.delete(el)
      return
    }
    anim.current += (anim.target - anim.current) * 0.3
    if (Math.abs(anim.target - anim.current) < 0.5) {
      setPos(el, anim.axis, anim.target)
      anims.delete(el)
      return
    }
    setPos(el, anim.axis, anim.current)
    anim.raf = requestAnimationFrame(step)
  }
  anims.get(el)!.raf = requestAnimationFrame(step)
}

function onWheel(e: WheelEvent) {
  // ctrl+wheel = zoom; defaultPrevented = başkası (ör. Radix) devraldı
  if (e.ctrlKey || e.defaultPrevented) return

  let dy = e.deltaY
  let dx = e.deltaX
  if (e.deltaMode === 1) {
    dy *= 16
    dx *= 16
  }

  // shift+wheel → yatay kaydırma (Chrome davranışı)…
  const shiftRemap = e.shiftKey && !dx && !!dy
  if (shiftRemap) {
    dx = dy
    dy = 0
  }

  let axis: Axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
  let delta = axis === "x" ? dx : dy
  if (!delta) return

  let el = findScroller(e.target, axis, delta)
  // …ama hedefte yatay scroller yoksa dikeye geri düş: oyunda Shift (koşma)
  // basılıyken telefon/dashboard dikey scroll'u ölmesin
  if (!el && shiftRemap) {
    axis = "y"
    delta = dx // remap edilen değer = orijinal deltaY
    el = findScroller(e.target, axis, delta)
  }
  if (!el) return
  e.preventDefault()

  let anim = anims.get(el)
  if (anim && anim.axis === axis) {
    anim.target = Math.max(0, Math.min(anim.target + delta, getMax(el, axis)))
    return
  }
  if (anim) cancelAnimationFrame(anim.raf)
  const pos = getPos(el, axis)
  anim = {
    target: Math.max(0, Math.min(pos + delta, getMax(el, axis))),
    current: pos,
    raf: 0,
    axis,
  }
  anims.set(el, anim)
  startAnim(el)
}

export function installSmoothScroll() {
  window.addEventListener("wheel", onWheel, { passive: false })
}
