import { ENDPOINTS, handleForm, validateContact } from '@/lib/forms'

// Homepage enquiry form and Contact page → ielapis /contactus/ (plan §5a).
export async function POST(req: Request) {
  return handleForm(req, validateContact, ENDPOINTS.contact)
}
