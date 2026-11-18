// Admin Authentication & Password Security Manager

const STORAGE_KEY_PASSWORD = 'the_write_magic_admin_custom_password';
const STORAGE_KEY_ADMIN_EMAIL = 'the_write_magic_admin_registered_email';

// Default Master Passwords for Aashna
export const MASTER_PASSWORDS = [
  'aashna1200',
  'aashna',
  'aashna2026',
  'aashna2025',
  'writemagic',
  'admin123',
];

export const adminAuth = {
  /**
   * Check if a custom password has already been established.
   */
  isPasswordSet(): boolean {
    return true;
  },

  /**
   * Get the saved administrator email, or default to Aashna's email.
   */
  getAdminEmail(): string {
    return localStorage.getItem(STORAGE_KEY_ADMIN_EMAIL) || 'aashnaagrawal1200@gmail.com';
  },

  /**
   * Update the administrator email.
   */
  setAdminEmail(email: string): void {
    localStorage.setItem(STORAGE_KEY_ADMIN_EMAIL, email.trim().toLowerCase());
  },

  /**
   * Set or update the custom admin password.
   */
  setPassword(newPassword: string): boolean {
    if (!newPassword || newPassword.trim().length < 3) {
      return false;
    }
    localStorage.setItem(STORAGE_KEY_PASSWORD, newPassword.trim());
    return true;
  },

  /**
   * Reset password back to default 'aashna1200'
   */
  resetToDefault(): void {
    localStorage.setItem(STORAGE_KEY_PASSWORD, 'aashna1200');
  },

  /**
   * Verify an attempted password:
   * 1. Matches custom stored password (case-insensitive & case-sensitive)
   * 2. Or matches any master password (aashna1200, aashna, etc.)
   */
  verifyPassword(passwordAttempt: string): boolean {
    const trimmed = (passwordAttempt || '').trim();
    if (!trimmed) return false;

    // Check custom saved password
    const stored = localStorage.getItem(STORAGE_KEY_PASSWORD);
    if (stored && (stored === trimmed || stored.toLowerCase() === trimmed.toLowerCase())) {
      return true;
    }

    // Check master passwords
    const isMasterMatch = MASTER_PASSWORDS.some(
      (p) => p.toLowerCase() === trimmed.toLowerCase()
    );

    if (isMasterMatch) {
      // Update/sync storage to ensure consistency
      localStorage.setItem(STORAGE_KEY_PASSWORD, trimmed);
      return true;
    }

    return false;
  },

  /**
   * Reset / change existing password with verification.
   */
  changePassword(currentPasswordAttempt: string, newPassword: string): { success: boolean; message: string } {
    if (!this.verifyPassword(currentPasswordAttempt)) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    if (!newPassword || newPassword.trim().length < 3) {
      return { success: false, message: 'New password must be at least 3 characters.' };
    }

    this.setPassword(newPassword);
    return { success: true, message: 'Password updated successfully!' };
  },
};
