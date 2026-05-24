import { apiRequest } from '@/services/api-client'

export function loginUser({ email, password }) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email: email.trim(), password },
  })
}

export function registerUser(data) {
  const body = {
    companyName: data.companyName.trim(),
    contactPerson: data.contactPerson.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    password: data.password,
    address: data.address.trim(),
    licenseNumber: data.licenseNumber?.trim() || '',
    website: data.website?.trim() || '',
    description: data.description?.trim() || '',
  }

  return apiRequest('/auth/register', {
    method: 'POST',
    body,
  })
}
