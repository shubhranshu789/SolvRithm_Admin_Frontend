'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
// import "../../Components/DashBoard"

import Navabr from "../../Components/Navbar/page"

type Project = {
  _id: string
  name: string
  img: string
  desc: string
  bigDesc: string
  googleForm: string
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  user: string
  createdAt: string
  updatedAt: string
  __v: number
}

export default function ProjectPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [data, setData] = React.useState<Project | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()


  const handleDelete = async () => {
    if (!id) return
    const ok = window.confirm('Delete this project? This cannot be undone.')
    if (!ok) return

    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`https://solvrithm-admin-backend.onrender.com/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok && res.status !== 204) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || 'Failed to delete project')
      }
      // Success: navigate away, e.g., to list page
      router.replace('/Components/DashBoard')
      router.refresh()
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (!id) return
    const ctrl = new AbortController()
      ; (async () => {
        try {
          setLoading(true)
          setError(null)
          const res = await fetch(`https://solvrithm-admin-backend.onrender.com/projects/${id}`, {
            signal: ctrl.signal,
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          })
          if (!res.ok) throw new Error('Failed to fetch project')
          const json = (await res.json()) as Project
          setData(json)
        } catch (e: any) {
          if (e.name !== 'AbortError') setError(e.message || 'Something went wrong')
        } finally {
          setLoading(false)
        }
      })()
    return () => ctrl.abort()
  }, [id])

  const priorityColor =
    data?.priority === 'high'
      ? 'bg-rose-500/20 text-rose-300 ring-rose-400/30'
      : data?.priority === 'medium'
        ? 'bg-amber-500/20 text-amber-300 ring-amber-400/30'
        : 'bg-emerald-500/20 text-emerald-300 ring-emerald-400/30'

  return (

    <div>
      <Navabr/>
      <div className="min-h-[calc(100svh-4rem)] w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          {!id && (
            <div className="text-center text-slate-300">
              Missing project id in query. [Add ?id=...] [web:7]
            </div>
          )}

          {loading && (
            <div className="mx-auto w-full max-w-md animate-pulse">
              <div className="h-64 rounded-2xl bg-white/5" />
              <div className="mt-6 h-6 w-3/5 rounded bg-white/5" />
              <div className="mt-3 h-4 w-full rounded bg-white/5" />
              <div className="mt-2 h-4 w-4/5 rounded bg-white/5" />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200">
              {error} [web:7]
            </div>
          )}

          {data && (
            <article
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl md:p-6"
              aria-labelledby="project-title"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <Image
                    src={data.img}
                    alt={data.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                </div>

                <div className="flex flex-col">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1 ${priorityColor}`}
                      title={`Priority: ${data.priority}`}
                    >
                      • {data.priority.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-200 ring-1 ring-sky-400/30">
                      Due {new Date(data.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h1
                    id="project-title"
                    className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
                  >
                    {data.name}
                  </h1>

                  <p className="mt-3 text-slate-300">
                    {data.desc}
                  </p>

                  <div className="mt-4 max-h-48 overflow-auto rounded-lg border border-white/10 bg-white/5 p-3 text-slate-200">
                    {data.bigDesc || 'No additional description.'}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur-xl">
                    {data.googleForm ? (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {/* Link with external icon */}
                        <a
                          href={data.googleForm}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex max-w-full items-center gap-2 text-sky-300 hover:text-sky-200"
                          aria-label="Open Google Form (opens in a new tab)"
                        >
                          <span className="truncate underline decoration-sky-400/60 underline-offset-4 group-hover:decoration-sky-300">
                            {data.googleForm}
                          </span>
                          <svg
                            className="h-4 w-4 shrink-0 opacity-80 group-hover:opacity-100"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path d="M14 3h7v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 14v7h-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 10l11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>

                        {/* Copy button */}
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(data.googleForm)
                              // Optional: small visual feedback
                              const el = document.getElementById('copy-toast')
                              if (el) {
                                el.classList.remove('opacity-0')
                                el.classList.add('opacity-100')
                                setTimeout(() => {
                                  el.classList.add('opacity-0')
                                  el.classList.remove('opacity-100')
                                }, 1200)
                              }
                            } catch {
                              // Fallback if clipboard API denied
                              alert('Link copied fallback:\n' + data.googleForm)
                            }
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-sky-500/90 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                          aria-label="Copy Google Form link"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M9 9h9v12H9z" stroke="currentColor" strokeWidth="2" />
                            <path d="M6 3h9v6" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          Copy
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-200">No form provided.</p>
                    )}

                    {/* Tiny toast */}
                    <div
                      id="copy-toast"
                      role="status"
                      aria-live="polite"
                      className="pointer-events-none mt-2 select-none text-xs text-emerald-300 transition-opacity duration-300 opacity-0"
                    >
                      Link copied
                    </div>
                  </div>


                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                    <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
                      <p className="text-slate-400">Created</p>
                      <p className="font-medium text-slate-200">
                        {new Date(data.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
                      <p className="text-slate-400">Updated</p>
                      <p className="font-medium text-slate-200">
                        {new Date(data.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center justify-center rounded-xl bg-rose-600/90 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                    >
                      Delete
                    </button>
                    {/* <a
                      href={`/projects/${data._id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-sky-500/90 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-sky-500"
                    >
                      Open
                    </a> */}
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/5 to-transparent" />
              <div className="pointer-events-none absolute -inset-1 -z-20 rounded-[28px] bg-gradient-to-br from-white/10 via-transparent to-white/5" />
            </article>
          )}
        </div>
      </div>
    </div>

  )
}
