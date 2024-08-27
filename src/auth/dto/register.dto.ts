import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';
  
  export class RegisterDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsString({ message: 'Please provide a valid username' })
    username: string;
  
    @IsEmail({}, { message: 'Please provide a valid email' })
    email: string;
  
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message:
        'Password too weak. It must include at least one digit or special character, one uppercase letter, and one lowercase letter.',
    })
    password: string;
  }
  