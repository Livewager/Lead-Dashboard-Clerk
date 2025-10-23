import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export function formatScore(score: number): string {
  return score.toFixed(1)
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case 'warm':
      return 'tier-warm'
    case 'hot':
      return 'tier-hot'
    case 'platinum':
      return 'tier-platinum'
    default:
      return 'tier-warm'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'available':
      return 'status-available'
    case 'being_claimed':
      return 'status-being-claimed'
    case 'claimed':
      return 'status-claimed-by-other'
    default:
      return 'status-available'
  }
}

export function getTierDisplayName(tier: string): string {
  switch (tier) {
    case 'warm':
      return 'Warm Lead'
    case 'hot':
      return 'Hot Lead'
    case 'platinum':
      return 'Platinum Lead'
    default:
      return 'Lead'
  }
}

export function getStatusDisplayName(status: string): string {
  switch (status) {
    case 'available':
      return 'Available'
    case 'being_claimed':
      return 'Being Claimed'
    case 'claimed':
      return 'Claimed'
    default:
      return 'Unknown'
  }
}

export function maskName(name?: string): string {
  if (!name) return '••••••••';
  const words = name.split(' ');
  if (words.length === 1) {
    return name.charAt(0) + '••••••';
  }
  return words.map(word => word.charAt(0) + '••••').join(' ');
}

export function maskEmail(email?: string): string {
  if (!email) return '••••@••••.com';
  const [localPart, domain] = email.split('@');
  if (!domain) return '••••@••••.com';
  const maskedLocal = localPart.slice(0, Math.min(2, localPart.length)) + '••••';
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone?: string): string {
  if (!phone) return '(•••) •••-••••';
  // Show only last 4 digits
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return '(•••) •••-••••';
  return `(•••) •••-${cleaned.slice(-4)}`;
}
