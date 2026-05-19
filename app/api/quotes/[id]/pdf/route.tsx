import { renderToBuffer } from '@react-pdf/renderer'
import { getQuoteById } from '@/lib/quotes'
import QuotePDF from '@/components/quotes/QuotePDF'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const quote = await getQuoteById(id)
  if (!quote) return new Response('Not found', { status: 404 })

  const buffer = await renderToBuffer(<QuotePDF quote={quote} />)

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${quote.number}.pdf"`,
    },
  })
}
