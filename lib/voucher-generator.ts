export function generateVoucherCode(prefix = "KT"): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // Removed confusing chars
  const length = 12
  const segments = 3
  const segmentLength = length / segments

  let code = prefix + "-"

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segmentLength; j++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      code += characters[randomIndex]
    }
    if (i < segments - 1) {
      code += "-"
    }
  }

  return code
}

export function generateTransactionReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TXN-${timestamp}-${random}`
}
