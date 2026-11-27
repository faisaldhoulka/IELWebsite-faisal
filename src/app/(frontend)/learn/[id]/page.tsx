import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContactBand } from '@/components/ui'
import { getBlog } from '@/lib/supabase-data'

export const revalidate = 60

type Params = { id: string }

// Article ids in the blogs table are UUIDs; anything else is a broken link (404),
// not a database error.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function load(id: string) {
  if (!UUID.test(id)) return { blog: null, failed: false }
  try {
    return { blog: await getBlog(id), failed: false }
  } catch {
    return { blog: null, failed: true }
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params
  const { blog } = await load(id)
  if (!blog) return { title: 'Article' }
  const description = blog.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)
  return {
    title: blog.title,
    description,
    alternates: { canonical: `/learn/${id}` },
    openGraph: { type: 'article', title: blog.title, description, ...(blog.image ? { images: [blog.image] } : {}) },
  }
}

/** Learn article (parity item 9): body is HTML from the blogs table, sanitised on the server. */
export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const { blog, failed } = await load(id)
  if (!blog && !failed) notFound()

  const date = blog?.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Karachi' })
    : null

  return (
    <>
      <section className="bg-mist border-b border-line">
        <div className="max-w-site mx-auto px-6 pt-14 pb-12 md:pt-20 md:pb-16 flex flex-col gap-5">
          <Link href="/learn" className="self-start font-semibold text-[15px] text-accent hover:text-accent-dark underline">
            ← All articles
          </Link>
          <span className="text-[13px] font-semibold tracking-[1.5px] uppercase text-wine">{date ? `Article · ${date}` : 'Article'}</span>
          <h1 className="m-0 max-w-[860px] font-serif font-medium text-[32px] md:text-[44px] leading-[1.15] text-pine">
            {blog ? blog.title : 'Article unavailable'}
          </h1>
        </div>
      </section>
      <section className="max-w-site mx-auto px-6 py-16 md:py-24">
        <div className="max-w-[760px]">
          {!blog ? (
            <div className="border border-line border-l-4 border-l-signal-red p-6 flex flex-col gap-3" role="alert">
              <p className="m-0 text-[15px] text-ink">This article could not be loaded. Please try again in a few minutes.</p>
              <Link href="/learn" className="self-start bg-accent hover:bg-accent-dark text-white no-underline px-[22px] py-[13px] rounded font-semibold text-[15px]">
                Back to articles
              </Link>
            </div>
          ) : (
            <article>
              {blog.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={blog.image} alt="" className="w-full max-h-[440px] object-cover border border-line mb-10" />
              )}
              <div className="iel-prose" dangerouslySetInnerHTML={{ __html: blog.html }} />
              <div className="mt-12 pt-6 border-t border-line">
                <Link href="/learn" className="font-semibold text-[15px] text-accent hover:text-accent-dark underline">
                  ← All articles
                </Link>
              </div>
            </article>
          )}
        </div>
      </section>
      <ContactBand />
    </>
  )
}
