import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    surname: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email: string;

}
