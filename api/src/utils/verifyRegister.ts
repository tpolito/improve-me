import { UserRegisterInput } from '../resolvers/InputTypes/UserRegisterInput';

export const verifyRegister = (options: UserRegisterInput) => {
  // Username Validate
  if (options.username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'Username must be longer than two characters',
      },
    ];
  }

  if (options.username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'username cannot contain "@"',
      },
    ];
  }

  // Email Validate
  if (!options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }

  // Pasword Validate
  if (options.password.length <= 5) {
    return [
      {
        field: 'password',
        message: 'Password must be longer than five characters',
      },
    ];
  }

  // This prevents "not all code paths return a value"
  return null;
};
