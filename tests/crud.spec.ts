import { test, expect, Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

const TEST_EMAIL    = 'test-e2e@crm-artisan.test'
const TEST_PASSWORD = 'TestPass123!'
const RUN           = Date.now()

async function login(page: Page) {
  await page.goto('/login')
  await page.locator('#email').fill(TEST_EMAIL)
  await page.locator('#password').fill(TEST_PASSWORD)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('**/clients')
}

async function getTestClient() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { error } = await supabase.auth.signInWithPassword({ email: TEST_EMAIL, password: TEST_PASSWORD })
  if (error) throw new Error(`Test Supabase auth failed: ${error.message}`)
  return supabase
}

// ── Clients ────────────────────────────────────────────────────────────────

test.describe.serial('Client CRUD', () => {
  const NAME    = `E2E Client ${RUN}`
  const UPDATED = `E2E Client ${RUN} Updated`

  test.beforeEach(async ({ page }) => { await login(page) })

  test('create client → success toast, appears in list', async ({ page }) => {
    await page.goto('/clients/new')
    await page.locator('#name').fill(NAME)
    await page.locator('#phone').fill('+33 6 00 00 00 01')
    await page.getByRole('button', { name: 'Save client' }).click()
    await expect(page.getByText('Client added successfully')).toBeVisible()
    await expect(page.getByText(NAME)).toBeVisible()
  })

  test('edit client → updated name in list', async ({ page }) => {
    await page.goto('/clients')
    await page.getByText(NAME, { exact: true }).click()
    await expect(page).toHaveURL(/\/clients\/.+\/edit/)
    await page.locator('#name').fill(UPDATED)
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByText('Client updated')).toBeVisible()
    await expect(page.getByText(UPDATED)).toBeVisible()
  })

  test('create without name → validation error', async ({ page }) => {
    await page.goto('/clients/new')
    await page.getByRole('button', { name: 'Save client' }).click()
    await expect(page.getByText('Name is required')).toBeVisible()
  })

  test('search filters by client name', async ({ page }) => {
    await page.goto('/clients')
    const input = page.getByPlaceholder('Search clients...')
    await input.fill(UPDATED.slice(0, 12))
    await expect(page.getByText(UPDATED)).toBeVisible()
    await input.fill('zzz_no_match')
    await expect(page.getByText(UPDATED)).not.toBeVisible()
    await expect(page.getByText(/No results for/)).toBeVisible()
  })

  test('delete blocked when client has job sites', async ({ page }) => {
    const supabase = await getTestClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: client } = await supabase.from('clients').select('id').eq('name', UPDATED).single()
    const { data: site } = await supabase.from('job_sites')
      .insert({ user_id: user!.id, client_id: client!.id, name: `Block ${RUN}`, status: 'planned' })
      .select('id').single()

    await page.goto('/clients')
    const card = page.locator('.card', { hasText: UPDATED })
    await card.getByLabel('Delete client').click()
    await page.getByRole('button', { name: 'Delete', exact: true }).click()
    await expect(page.getByText('This client has job sites')).toBeVisible()
    await page.getByRole('button', { name: 'OK' }).click()

    await supabase.from('job_sites').delete().eq('id', site!.id)
  })

  test('delete client → success toast, gone from list', async ({ page }) => {
    await page.goto('/clients')
    const card = page.locator('.card', { hasText: UPDATED })
    await card.getByLabel('Delete client').click()
    await page.getByRole('button', { name: 'Delete', exact: true }).click()
    await expect(page.getByText('Client deleted')).toBeVisible()
    await expect(page.getByText(UPDATED)).not.toBeVisible()
  })
})

// ── Job Sites ──────────────────────────────────────────────────────────────

test.describe.serial('Job Site CRUD', () => {
  const CLIENT_NAME = `E2E JS Client ${RUN}`
  const NAME        = `E2E Job Site ${RUN}`
  const UPDATED     = `E2E Job Site ${RUN} Updated`
  let clientId: string
  let jobSiteId: string

  test.beforeEach(async ({ page }) => { await login(page) })

  test.beforeAll(async () => {
    const supabase = await getTestClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: client, error } = await supabase.from('clients')
      .insert({ user_id: user!.id, name: CLIENT_NAME })
      .select('id').single()
    if (error) throw error
    clientId = client!.id
  })

  test.afterAll(async () => {
    const supabase = await getTestClient()
    if (jobSiteId) {
      await supabase.from('quotes').delete().eq('job_site_id', jobSiteId)
      await supabase.from('job_sites').delete().eq('id', jobSiteId)
    }
    await supabase.from('clients').delete().eq('id', clientId)
  })

  test('create job site → success toast, appears in list', async ({ page }) => {
    await page.goto('/jobs/new')
    await page.locator('#client_id').selectOption({ value: clientId })
    await page.locator('#name').fill(NAME)
    await page.getByRole('button', { name: 'Save job site' }).click()
    await expect(page.getByText('Job site added')).toBeVisible()
    await expect(page.getByText(NAME)).toBeVisible()

    const supabase = await getTestClient()
    const { data: site } = await supabase.from('job_sites').select('id').eq('name', NAME).single()
    jobSiteId = site!.id
  })

  test('edit job site → updated name in list', async ({ page }) => {
    await page.goto('/jobs')
    await page.getByText(NAME, { exact: true }).click()
    await expect(page).toHaveURL(/\/jobs\/.+\/edit/)
    await page.locator('#name').fill(UPDATED)
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByText('Job site updated')).toBeVisible()
    await expect(page.getByText(UPDATED)).toBeVisible()
  })

  test('create without title → validation error', async ({ page }) => {
    await page.goto('/jobs/new')
    await page.locator('#client_id').selectOption({ value: clientId })
    await page.getByRole('button', { name: 'Save job site' }).click()
    await expect(page.getByText('Title is required')).toBeVisible()
  })

  test('create without client → validation error', async ({ page }) => {
    await page.goto('/jobs/new')
    await page.locator('#name').fill('No client test')
    await page.getByRole('button', { name: 'Save job site' }).click()
    await expect(page.getByText('Please select a client')).toBeVisible()
  })

  test('status filter shows matching job sites only', async ({ page }) => {
    await page.goto('/jobs')
    await page.getByRole('button', { name: 'Planned' }).click()
    await expect(page.getByText(UPDATED)).toBeVisible()
    await page.getByRole('button', { name: 'Active' }).click()
    await expect(page.getByText(UPDATED)).not.toBeVisible()
  })

  test('delete blocked when job site has a quote', async ({ page }) => {
    const supabase = await getTestClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: quote } = await supabase.from('quotes')
      .insert({
        user_id:     user!.id,
        job_site_id: jobSiteId,
        title:       `Block quote ${RUN}`,
        status:      'draft',
        issue_date:  new Date().toISOString().split('T')[0],
      })
      .select('id').single()

    await page.goto('/jobs')
    const card = page.locator('.card', { hasText: UPDATED })
    await card.getByLabel('Delete job site').click()
    await page.getByRole('button', { name: 'Delete', exact: true }).click()
    await expect(page.getByText('This job site has quotes')).toBeVisible()
    await page.getByRole('button', { name: 'OK' }).click()

    await supabase.from('quotes').delete().eq('id', quote!.id)
  })

  test('delete job site → success toast, gone from list', async ({ page }) => {
    await page.goto('/jobs')
    const card = page.locator('.card', { hasText: UPDATED })
    await card.getByLabel('Delete job site').click()
    await page.getByRole('button', { name: 'Delete', exact: true }).click()
    await expect(page.getByText('Job site deleted')).toBeVisible()
    await expect(page.getByText(UPDATED)).not.toBeVisible()
    jobSiteId = ''
  })
})

// ── Quote lifecycle ────────────────────────────────────────────────────────

test.describe.serial('Quote lifecycle', () => {
  const CLIENT_NAME   = `E2E Q Client ${RUN}`
  const JOB_SITE_NAME = `E2E Q Job Site ${RUN}`
  const QUOTE_TITLE   = `E2E Quote ${RUN}`
  let clientId: string
  let jobSiteId: string
  let quoteUrl: string

  test.beforeEach(async ({ page }) => { await login(page) })

  test.beforeAll(async () => {
    const supabase = await getTestClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: client, error: ce } = await supabase.from('clients')
      .insert({ user_id: user!.id, name: CLIENT_NAME })
      .select('id').single()
    if (ce) throw ce
    clientId = client!.id

    const { data: site, error: se } = await supabase.from('job_sites')
      .insert({ user_id: user!.id, client_id: clientId, name: JOB_SITE_NAME, status: 'planned' })
      .select('id').single()
    if (se) throw se
    jobSiteId = site!.id
  })

  test.afterAll(async () => {
    const supabase = await getTestClient()
    await supabase.from('quotes').delete().eq('job_site_id', jobSiteId)
    await supabase.from('job_sites').delete().eq('id', jobSiteId)
    await supabase.from('clients').delete().eq('id', clientId)
  })

  test('create draft with 2 line items → Draft in quote list', async ({ page }) => {
    await page.goto('/quotes/new')
    await page.locator('#job_site_id').selectOption({ value: jobSiteId })
    await page.locator('#title').fill(QUOTE_TITLE)
    await page.locator('#tax_rate').fill('20')

    await page.getByRole('button', { name: 'Add item' }).click()
    await page.locator('input[name="items[0][description]"]').fill('Labour')
    await page.locator('input[name="items[0][quantity]"]').fill('8')
    await page.locator('input[name="items[0][unit_price]"]').fill('75')

    await page.getByRole('button', { name: 'Add item' }).click()
    await page.locator('input[name="items[1][description]"]').fill('Materials')
    await page.locator('input[name="items[1][quantity]"]').fill('1')
    await page.locator('input[name="items[1][unit_price]"]').fill('200')

    await page.getByRole('button', { name: 'Save draft' }).click()
    await page.waitForURL(/\/quotes\/[a-f0-9-]{36}$/)
    quoteUrl = page.url()

    await page.goto('/quotes')
    await expect(page.getByText(QUOTE_TITLE)).toBeVisible()
    await expect(page.locator('.card', { hasText: QUOTE_TITLE }).getByText('Draft')).toBeVisible()
  })

  test('create without title → validation error', async ({ page }) => {
    await page.goto('/quotes/new')
    await page.locator('#job_site_id').selectOption({ value: jobSiteId })
    await page.getByRole('button', { name: 'Save draft' }).click()
    await expect(page.getByText('Title is required')).toBeVisible()
  })

  test('send quote → Sent status + success toast', async ({ page }) => {
    await page.goto(quoteUrl)
    await page.getByRole('button', { name: 'Send quote' }).click()
    await expect(page.getByText('Quote sent')).toBeVisible()
    await expect(page.getByText('Sent', { exact: true })).toBeVisible()
  })

  test('mark accepted → Accepted status + success toast', async ({ page }) => {
    await page.goto(quoteUrl)
    await page.getByRole('button', { name: 'Mark accepted' }).click()
    await page.waitForURL(/\/quotes\/[a-f0-9-]{36}/)
    await expect(page.getByText('Quote accepted')).toBeVisible()
    await expect(page.getByText('Accepted', { exact: true })).toBeVisible()
  })

  test('status filter: Accepted shows quote, Draft hides it', async ({ page }) => {
    await page.goto('/quotes')
    await page.getByRole('button', { name: 'Accepted' }).click()
    await expect(page.getByText(QUOTE_TITLE)).toBeVisible()
    await page.getByRole('button', { name: 'Draft' }).click()
    await expect(page.getByText(QUOTE_TITLE)).not.toBeVisible()
  })

  test('PDF download → file downloaded with correct name', async ({ page }) => {
    await page.goto(quoteUrl)
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link', { name: /Download PDF/i }).click(),
    ])
    expect(download.suggestedFilename()).toMatch(/^Q-\d{4}-\d{3}\.pdf$/)
  })

  test('delete quote → success toast, gone from list', async ({ page }) => {
    await page.goto('/quotes')
    const card = page.locator('.card', { hasText: QUOTE_TITLE })
    await card.getByLabel('Delete quote').click()
    await page.getByRole('button', { name: 'Delete', exact: true }).click()
    await expect(page.getByText('Quote deleted')).toBeVisible()
    await expect(page.getByText(QUOTE_TITLE)).not.toBeVisible()
  })
})
