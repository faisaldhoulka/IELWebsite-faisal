/**
 * "What we do" as a typographic index (ui-ux-pro-max: Exaggerated Minimalism within
 * the Trust & Authority pattern): one row per service, the name set large in light
 * serif, the description always visible beside it, hairline rules between rows.
 * Hover only adds emphasis (fill sweep, colour, arrow), never hides content, so it
 * works the same on touch screens. Motion is off under reduced motion.
 */
export type IndexItem = { title: string; text?: string | null }

export function ServiceIndex({ items, ctaHref = '/#contact' }: { items: IndexItem[]; ctaHref?: string }) {
  return (
    <ul className="list-none m-0 p-0 border-t border-pine">
      {items.map((it) => (
        <li key={it.title} className="group relative isolate border-b border-line">
          {/* Fill that sweeps in from the left on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-mist origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100 motion-reduce:transition-none"
          />
          <div className="grid gap-4 py-8 md:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_auto] lg:gap-12 lg:items-center px-0 lg:px-6">
            <h3 className="m-0 font-serif font-light text-[30px] sm:text-[38px] lg:text-[46px] leading-[1.08] tracking-[-0.015em] text-ink transition-[color,transform] duration-300 group-hover:text-pine lg:group-hover:translate-x-2 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
              {it.title}
            </h3>
            {it.text && <p className="m-0 text-[16px] leading-[1.7] text-muted-body max-w-[520px]">{it.text}</p>}
            <a
              href={ctaHref}
              aria-label={`Discuss ${it.title} with us`}
              className="justify-self-start lg:justify-self-end inline-flex items-center justify-center w-12 h-12 rounded-full border border-pine text-pine no-underline transition-colors duration-300 group-hover:bg-pine group-hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </li>
      ))}
    </ul>
  )
}
