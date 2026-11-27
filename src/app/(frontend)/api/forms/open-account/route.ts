import { ENDPOINTS, handleForm, validateOpenAccount } from '@/lib/forms'

// Open Account quick sign-up → ielapis /free-account/ (plan §5a). Payload: { phone, name }.
export async function POST(req: Request) {
  return handleForm(req, validateOpenAccount, ENDPOINTS.openAccount)
}
