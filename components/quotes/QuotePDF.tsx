import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer'
import type { Quote } from '@/lib/quotes'
import { calculateQuoteTotal } from '@/lib/calculate-quote-total'
import { ARTISAN } from '@/lib/artisan'

const PRIMARY = '#E07B00'
const NEUTRAL_500 = '#737373'
const NEUTRAL_200 = '#E5E5E5'
const NEUTRAL_900 = '#171717'

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, color: NEUTRAL_900, padding: 40, paddingBottom: 60 },

  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  artisanName: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: PRIMARY, marginBottom: 3 },
  artisanMeta: { fontSize: 9, color: NEUTRAL_500, lineHeight: 1.5 },
  quoteRef: { alignItems: 'flex-end' },
  quoteNumber: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  quoteMeta: { fontSize: 9, color: NEUTRAL_500, lineHeight: 1.5, textAlign: 'right' },

  divider: { borderBottomWidth: 1, borderBottomColor: NEUTRAL_200, marginBottom: 16 },

  billRow: { flexDirection: 'row', gap: 32, marginBottom: 24 },
  billBlock: { flex: 1 },
  billLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: NEUTRAL_500, marginBottom: 4, letterSpacing: 0.6 },
  billValue: { fontSize: 10, color: NEUTRAL_900 },

  tableHeader: { flexDirection: 'row', paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: NEUTRAL_200, marginBottom: 6 },
  tableHeaderText: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: NEUTRAL_500, letterSpacing: 0.5 },
  colDesc: { flex: 1 },
  colQty: { width: 40, textAlign: 'right' },
  colPrice: { width: 64, textAlign: 'right' },
  colTotal: { width: 64, textAlign: 'right' },

  tableRow: { flexDirection: 'row', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: NEUTRAL_200 },
  tableCell: { fontSize: 10 },

  totalsBlock: { alignItems: 'flex-end', marginTop: 16 },
  totalsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 0, marginBottom: 4, width: 180 },
  totalsLabel: { flex: 1, fontSize: 9, color: NEUTRAL_500, textAlign: 'left' },
  totalsValue: { width: 72, fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  totalsDivider: { borderBottomWidth: 1, borderBottomColor: NEUTRAL_200, marginBottom: 6, width: 180 },
  totalRow: { flexDirection: 'row', width: 180, marginTop: 2 },
  totalLabel: { flex: 1, fontSize: 11, fontFamily: 'Helvetica-Bold', textAlign: 'left' },
  totalValue: { width: 72, fontSize: 11, fontFamily: 'Helvetica-Bold', color: PRIMARY, textAlign: 'right' },

  notesSection: { marginTop: 24 },
  notesLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: NEUTRAL_500, marginBottom: 6, letterSpacing: 0.6 },
  notesText: { fontSize: 9, color: NEUTRAL_900, lineHeight: 1.6 },

  pageNumber: { position: 'absolute', bottom: 24, left: 40, right: 40, flexDirection: 'row', justifyContent: 'flex-end' },
  pageNumberText: { fontSize: 8, color: NEUTRAL_500 },
})

function fmtDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmt(n: number): string {
  return `$${n.toFixed(2)}`
}

export default function QuotePDF({ quote }: { quote: Quote }) {
  const totals = calculateQuoteTotal(quote.line_items, quote.tax_rate)

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header: artisan left, quote ref right */}
        <View style={s.header}>
          <View>
            <Text style={s.artisanName}>{ARTISAN.name}</Text>
            <Text style={s.artisanMeta}>{ARTISAN.trade}</Text>
            <Text style={s.artisanMeta}>{ARTISAN.address}</Text>
            <Text style={s.artisanMeta}>{ARTISAN.phone}  ·  {ARTISAN.email}</Text>
          </View>
          <View style={s.quoteRef}>
            <Text style={s.quoteNumber}>{quote.number}</Text>
            <Text style={s.quoteMeta}>Issued: {fmtDate(quote.issue_date)}</Text>
            {quote.expiry_date && (
              <Text style={s.quoteMeta}>Expires: {fmtDate(quote.expiry_date)}</Text>
            )}
          </View>
        </View>

        <View style={s.divider} />

        {/* Bill to / Job site */}
        <View style={s.billRow}>
          <View style={s.billBlock}>
            <Text style={s.billLabel}>Bill to</Text>
            <Text style={s.billValue}>{quote.client_name}</Text>
          </View>
          <View style={s.billBlock}>
            <Text style={s.billLabel}>Job site</Text>
            <Text style={s.billValue}>{quote.job_site_name}</Text>
          </View>
          {quote.title && (
            <View style={s.billBlock}>
              <Text style={s.billLabel}>Quote for</Text>
              <Text style={s.billValue}>{quote.title}</Text>
            </View>
          )}
        </View>

        {/* Line items table */}
        {quote.line_items.length > 0 && (
          <View>
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderText, s.colDesc]}>Description</Text>
              <Text style={[s.tableHeaderText, s.colQty]}>Qty</Text>
              <Text style={[s.tableHeaderText, s.colPrice]}>Unit price</Text>
              <Text style={[s.tableHeaderText, s.colTotal]}>Total</Text>
            </View>
            {quote.line_items.map(item => (
              <View key={item.id} style={s.tableRow} wrap={false}>
                <Text style={[s.tableCell, s.colDesc]}>{item.description}</Text>
                <Text style={[s.tableCell, s.colQty, { textAlign: 'right' }]}>{item.quantity}</Text>
                <Text style={[s.tableCell, s.colPrice, { textAlign: 'right' }]}>{fmt(item.unit_price)}</Text>
                <Text style={[s.tableCell, s.colTotal, { textAlign: 'right' }]}>{fmt(item.quantity * item.unit_price)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Totals */}
        <View style={s.totalsBlock}>
          <View style={s.totalsRow}>
            <Text style={s.totalsLabel}>Subtotal</Text>
            <Text style={s.totalsValue}>{fmt(totals.subtotal)}</Text>
          </View>
          {quote.tax_rate > 0 && (
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>Tax ({quote.tax_rate}%)</Text>
              <Text style={s.totalsValue}>{fmt(totals.taxAmount)}</Text>
            </View>
          )}
          <View style={s.totalsDivider} />
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>{fmt(totals.total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {quote.notes && (
          <View style={s.notesSection}>
            <Text style={s.notesLabel}>Notes</Text>
            <Text style={s.notesText}>{quote.notes}</Text>
          </View>
        )}

        {/* Page number */}
        <View style={s.pageNumber} fixed>
          <Text
            style={s.pageNumberText}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />
        </View>

      </Page>
    </Document>
  )
}
