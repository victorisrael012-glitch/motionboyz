/**
 * Serverless function: /api/verify
 * Verifies a Paystack transaction on the backend after payment.
 *
 * Deploy on Vercel (api/verify.js) or Netlify (netlify/functions/verify.js).
 *
 * Usage: POST /api/verify  { reference: "ref_xxxxxxx" }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { reference } = req.body

  if (!reference) {
    return res.status(400).json({ error: 'Transaction reference is required' })
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (!data.status || data.data.status !== 'success') {
      return res.status(400).json({ error: 'Payment verification failed', data })
    }

    // TODO: Update your database order status here
    return res.status(200).json({ success: true, data: data.data })
  } catch (error) {
    console.error('Paystack verify error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
