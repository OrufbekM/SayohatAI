const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[0-9]{10,15}$/
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

function validatePassword(password, errors) {
  if (!password) {
    errors.password = 'Parolni kiriting'
  } else if (password.length < 8) {
    errors.password = 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak'
  } else if (!PASSWORD_RE.test(password)) {
    errors.password =
      'Parol katta va kichik harf, raqam hamda maxsus belgidan iborat bo\'lishi kerak'
  }
}

export function validateLogin({ email, password }) {
  const errors = {}

  if (!email?.trim()) {
    errors.email = 'Email manzilini kiriting'
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = 'To\'g\'ri email manzilini kiriting'
  }

  validatePassword(password, errors)

  return errors
}

export function validateRegister(data) {
  const errors = {}
  const companyName = data.companyName?.trim() ?? ''
  const contactPerson = data.contactPerson?.trim() ?? ''
  const email = data.email?.trim() ?? ''
  const phone = data.phone?.trim() ?? ''
  const address = data.address?.trim() ?? ''
  const password = data.password ?? ''
  const licenseNumber = data.licenseNumber?.trim() ?? ''
  const website = data.website?.trim() ?? ''
  const description = data.description?.trim() ?? ''

  if (!companyName) {
    errors.companyName = 'Sayohat agentligi nomini kiriting'
  } else if (companyName.length < 2 || companyName.length > 100) {
    errors.companyName = 'Nom 2 dan 100 tagacha belgidan iborat bo\'lishi kerak'
  }

  if (!contactPerson) {
    errors.contactPerson = 'Mas\'ul shaxs ismini kiriting'
  } else if (contactPerson.length < 2 || contactPerson.length > 100) {
    errors.contactPerson = 'Ism 2 dan 100 tagacha belgidan iborat bo\'lishi kerak'
  }

  if (!email) {
    errors.email = 'Email manzilini kiriting'
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'To\'g\'ri email manzilini kiriting'
  }

  if (!phone) {
    errors.phone = 'Telefon raqamini kiriting'
  } else if (!PHONE_RE.test(phone)) {
    errors.phone = 'Telefon raqami +998901234567 formatida bo\'lishi kerak'
  }

  if (!address) {
    errors.address = 'Agentlik manzilini kiriting'
  } else if (address.length > 255) {
    errors.address = 'Manzil 255 belgidan oshmasligi kerak'
  }

  validatePassword(password, errors)

  if (licenseNumber && licenseNumber.length > 50) {
    errors.licenseNumber = 'Litsenziya raqami 50 belgidan oshmasligi kerak'
  }

  if (website) {
    try {
      const url = new URL(website.includes('://') ? website : `https://${website}`)
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.website = 'To\'g\'ri veb-sayt manzilini kiriting'
      }
    } catch {
      errors.website = 'To\'g\'ri veb-sayt manzilini kiriting'
    }
  }

  if (description && description.length > 1000) {
    errors.description = 'Tavsif 1000 belgidan oshmasligi kerak'
  }

  return errors
}
