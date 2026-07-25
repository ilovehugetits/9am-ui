import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/lib/utils"

function Viewport({
  className,
  children,
  hideBottomFade = false,
  // fade/glass'in karıştığı renk — viewport'un kendi bg'siyle eşleşmeli.
  // transparent viewport'larda (dashboard) sayfa zemini olan --background doğru;
  // bg-card kullanan viewport'lar "var(--card)" geçmeli
  fadeColor = "var(--background)",
  style,
  ...props
}: React.ComponentProps<"div"> & { hideBottomFade?: boolean; fadeColor?: string }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const thumbRef = React.useRef<HTMLDivElement>(null)
  // scrollbar sadece içerik taşıyorsa var; opacity ile hover'da yumuşak belirir
  const [scrollable, setScrollable] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)

  // thumb ölçülerini imperative güncelle (scroll'da re-render olmasın)
  const update = React.useCallback(() => {
    const el = scrollRef.current
    const thumb = thumbRef.current
    if (!el || !thumb) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const canScroll = scrollHeight > clientHeight + 1
    setScrollable((prev) => (prev === canScroll ? prev : canScroll))
    if (!canScroll) return
    const h = Math.max((clientHeight / scrollHeight) * clientHeight, 24)
    const maxScroll = scrollHeight - clientHeight
    const maxTop = clientHeight - h
    const top = maxScroll > 0 ? (scrollTop / maxScroll) * maxTop : 0
    thumb.style.height = `${h}px`
    thumb.style.transform = `translateY(${top}px)`
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    update()
    el.addEventListener("scroll", update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    for (const child of Array.from(el.children)) ro.observe(child)
    return () => {
      el.removeEventListener("scroll", update)
      ro.disconnect()
    }
  }, [update])

  // wheel scroll'u lib/smooth-scroll.ts'teki global handler sürer (FiveM CEF
  // clip-path'li scroller'ı wheel ile kaydırmadığı için scroll JS'te yapılır)

  const onThumbPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current
    if (!el) return
    e.preventDefault()
    setDragging(true)
    const startY = e.clientY
    const startScroll = el.scrollTop
    const { scrollHeight, clientHeight } = el
    const h = Math.max((clientHeight / scrollHeight) * clientHeight, 24)
    const maxTop = clientHeight - h
    const maxScroll = scrollHeight - clientHeight
    const move = (ev: PointerEvent) => {
      const delta = ev.clientY - startY
      el.scrollTop =
        startScroll + (maxTop > 0 ? (delta / maxTop) * maxScroll : 0)
    }
    const up = () => {
      setDragging(false)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
  }

  return (
    <div
      ref={scrollRef}
      data-slot="viewport"
      className={cn(
        "group/viewport bg-card rounded-2xl text-card-foreground border relative shadow-sm overflow-y-auto scrollbar-none mb-3",
        className
      )}
      // rounded + overflow'un kendi kırpması composited katmanlara (kaydırılan içerik,
      // backdrop-filter çıktısı) uygulanmıyor — clip-path compositor'da HER katmanı
      // köşe yarıçapıyla kırpar. yarıçap rounded-2xl ile aynı token'dan gelir
      style={{ clipPath: "inset(0 round var(--radius-2xl))", ...style }}
      {...props}
    >
      {/* üst fade + arkasında kademeli glass blur.
          blur, motion ağacının DIŞINDA statik durur: fake header'ın animate edilen
          filter'ı backdrop-filter'ı bloklayabildiği için burada yaşıyor.
          yükseklik fake header'dan ölçülür (--viewport-header-h), sadece header
          pin olunca opacity ile belirir — scroll 0'da gerçek header'ı bulanıklaştırmaz */}
      <div
        aria-hidden="true"
        className="pointer-events-none w-full sticky top-0 !z-20 h-4"
      >
        <div
          className="absolute inset-x-0 top-0"
          style={{ height: "var(--viewport-header-h, 1rem)" }}
        >
          {/* okunabilirlik için hafif tint, blur ile birlikte belirir */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-200 group-data-[header-pinned]/viewport:opacity-[1]"
            style={{
              background: `linear-gradient(to bottom, ${fadeColor} 0%, transparent 100%)`,
            }}
          />
          <GlassStack
            side="top"
            className="opacity-0 transition-opacity duration-200 group-data-[header-pinned]/viewport:opacity-100"
          />
        </div>
        {/* fade blur'un üzerine biner (sonraki sibling) — glass bantlarının sert
            kenarlarını da bu gradient gizler. Tailwind gradient class'ı (color-mix)
            FiveM CEF'te render olmuyor, bu yüzden inline linear-gradient */}
        <div
          className="absolute inset-x-0 top-0 h-4"
          style={{
            background: `linear-gradient(to bottom, ${fadeColor} 0%, ${fadeColor} 25%, transparent 100%)`,
          }}
        />
      </div>

      {/* özel scrollbar thumb — hover'da opacity ile yumuşak belirir (native gibi pat değil) */}
      <div aria-hidden="true" className="pointer-events-none sticky top-0 z-40 h-0">
        <div
          ref={thumbRef}
          onPointerDown={onThumbPointerDown}
          className={cn(
            "pointer-events-auto absolute right-0 top-0 w-1 rounded-full bg-black/30 dark:bg-white/40 hover:bg-black/50 dark:hover:bg-white/70 opacity-0 transition-opacity duration-200 select-none will-change-transform",
            scrollable ? "group-hover/viewport:opacity-100" : "pointer-events-none",
            dragging && "!opacity-100"
          )}
        />
      </div>

      {children}

      {/* alt fade — pb-2 (8px) bölgesini kaplar, üst fade'in aynası.
          sticky bottom-0 + h-0 sarmalayıcı → flow tüketmeden alt kenara sabitlenir.
          içerik taşmıyorsa (scroll yok) opacity ile gizlenir */}
      {!hideBottomFade && (
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none sticky bottom-0 !z-20 h-0 transition-opacity duration-200",
          !scrollable && "opacity-0"
        )}
      >
        {/* alt glass — tek katman 1px blur, alt fade'in arkasında yukarı doğru silinir */}
        <div className="absolute inset-x-0 bottom-0 h-2 opacity-100">
          <GlassStack side="bottom" blur={1} />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-2"
          style={{
            background: `linear-gradient(to top, ${fadeColor} 0%, ${fadeColor} 10%, transparent 100%)`,
          }}
        />
      </div>
      )}
    </div>
  )
}

// Kademeli "liquid glass" blur: viewport kenarında güçlü, içeri doğru silinir.
// FiveM CEF (Chromium 103) mask/clip'i backdrop-filter ÇIKTISINA uygulamıyor
// (crbug.com/41465359 — güncel Chrome'da düzeldi, CEF m103'te yok). Gradient
// mask yerine kenara sabit, gitgide kısalan sert kenarlı şeritler kullanılır.
// Şeritler üst üste bindiği yerde blur karesel toplanır (√Σb²); şerit blur'ları
// birleşik blur kenara doğru DOĞRUSAL artacak şekilde seçilir — her basamak
// eşit ve yarım px'in altında kaldığı için göz kademeleri seçemez.
function makeGlassLayers(edgeBlur: number, steps: number) {
  const maxSpan = 84
  const minSpan = 14
  return Array.from({ length: steps }, (_, i) => {
    const t0 = (edgeBlur * i) / steps
    const t1 = (edgeBlur * (i + 1)) / steps
    return {
      blur: Math.sqrt(t1 * t1 - t0 * t0),
      span: maxSpan - (i * (maxSpan - minSpan)) / (steps - 1 || 1),
    }
  })
}

// kenarda ~3.5px birleşik blur, 14 kademede sıfıra iner (basamak başına ~0.25px)
const glassLayers = makeGlassLayers(3.5, 14)

function GlassStack({
  side,
  className,
  blur: singleBlur,
}: {
  side: "top" | "bottom"
  className?: string
  blur?: number
}) {
  const layers =
    singleBlur !== undefined ? makeGlassLayers(singleBlur, 5) : glassLayers
  return (
    <>
      {layers.map(({ blur, span }, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-x-0",
            side === "top" ? "top-0" : "bottom-0",
            className
          )}
          style={{
            height: `${span.toFixed(1)}%`,
            backdropFilter: `blur(${blur.toFixed(2)}px)`,
            WebkitBackdropFilter: `blur(${blur.toFixed(2)}px)`,
          }}
        />
      ))}
    </>
  )
}

// FiveM CEF (Chromium 103) :has() ve @container'ı desteklemiyor (105+ gerekiyor) —
// grid-cols burada JS ile, ViewportAction çocuğu React seviyesinde algılanarak uygulanıyor
const headerGrid =
  "grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 [.border-b]:pb-6"

function ViewportHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null)
  const fakeRef = React.useRef<HTMLDivElement>(null)
  // :has-data-[slot=viewport-action] yerine: ViewportAction çocuğu var mı diye React'te bak
  const hasAction = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === ViewportAction
  )
  // orijinal header'ın yarısı kadar kaydırılınca "pinned" olur
  const [pinned, setPinned] = React.useState(false)
  // fake header ekranda mı: pin olunca true, out animasyonu bitince false.
  // gerçek header'ın, fake tamamen gitmeden görünüp üst üste binmesini engeller.
  const [fakeShown, setFakeShown] = React.useState(false)

  React.useEffect(() => {
    if (pinned) {
      setFakeShown(true)
      return
    }
    // fake out animasyonu (150ms) bitmeye 50ms kala gerçek header devralır
    const t = setTimeout(() => setFakeShown(false), 100)
    return () => clearTimeout(t)
  }, [pinned])

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const root = el.closest('[data-slot="viewport"]') as HTMLElement | null
    const observer = new IntersectionObserver(
      ([entry]) => setPinned(entry.intersectionRatio < 0.5),
      { root, threshold: [0, 0.5, 1] }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // fake header yüksekliğini viewport köküne yazar — üst glass blur bununla boyutlanır
  React.useEffect(() => {
    const el = fakeRef.current
    const root = el?.closest('[data-slot="viewport"]') as HTMLElement | null
    if (!el || !root) return
    const ro = new ResizeObserver(() => {
      root.style.setProperty("--viewport-header-h", `${el.offsetHeight}px`)
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.removeProperty("--viewport-header-h")
    }
  }, [])

  // pinned durumunu data attribute ile köke yansıtır — Viewport'taki blur
  // CSS transition ile belirir/kaybolur, motion'a hiç dokunmaz
  React.useEffect(() => {
    const root = fakeRef.current?.closest(
      '[data-slot="viewport"]'
    ) as HTMLElement | null
    if (!root) return
    if (pinned) root.setAttribute("data-header-pinned", "")
    else root.removeAttribute("data-header-pinned")
    return () => root.removeAttribute("data-header-pinned")
  }, [pinned])

  // gerçek header, pin sırasında VE fake out animasyonu bitene kadar gizli kalır
  const hideReal = pinned || fakeShown

  return (
    <>
      {/* çakma (fake) sticky header — kaydırınca animasyonla gelir. glass blur burada
          DEĞİL, Viewport'un üst fade katmanında: motion'ın animate ettiği filter bu
          elemanı backdrop root yapıp içindeki backdrop-filter'ı bloklayabiliyor */}
      <div className="pointer-events-none sticky top-0 z-20 h-0 overflow-visible">
        <motion.div
          ref={fakeRef}
          initial={false}
          animate={
            pinned
              ? { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.25, ease: "easeOut" } }
              : { opacity: 0, y: -2, filter: "blur(1px)", transition: { duration: 0.15, ease: "easeOut" } }
          }
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ willChange: "opacity, transform, filter" }}
          className={cn(
            headerGrid,
            hasAction && "grid-cols-[1fr_auto]",
            "absolute inset-x-0 top-0 p-3 pt-4 !text-sm",
            pinned ? "pointer-events-auto" : "pointer-events-none",
            className
          )}
        >
          {children}
        </motion.div>
      </div>

      {/* orijinal header — normal block, p-0, kaydırınca blur ile kaybolur */}
      <motion.div
        ref={ref}
        data-slot="viewport-header"
        initial={false}
        animate={
          hideReal
            ? { opacity: 0, filter: "blur(2px)" }
            : { opacity: 1, filter: "blur(0px)" }
        }
        transition={{ duration: hideReal ? 0.3 : 0.3, ease: "easeOut"}}
        className={cn(headerGrid, hasAction && "grid-cols-[1fr_auto]", "!pr-3", hideReal && "pointer-events-none", className)}
        {...(props as HTMLMotionProps<"div">)}
      >
        {children}
      </motion.div>
    </>
  )
}

function ViewportTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="viewport-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function ViewportDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="viewport-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function ViewportAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="viewport-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function ViewportContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="viewport-content"
      className={cn("px-2 mb-1.5 rounded-b-2xl", className)}
      {...props}
    />
  )
}

function ViewportFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="viewport-footer"
      className={cn("flex items-center px-4 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Viewport,
  ViewportHeader,
  ViewportFooter,
  ViewportTitle,
  ViewportAction,
  ViewportDescription,
  ViewportContent,
}
