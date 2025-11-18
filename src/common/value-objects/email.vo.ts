export class Email {
  private constructor(private readonly _value: string) {}

  get value(): string {
    return this._value;
  }

  static create(email: string): Email {
    if (!email || !Email.isValid(email)) {
      throw new Error('Invalid email');
    }
    return new Email(email.trim().toLowerCase());
  }

  static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
