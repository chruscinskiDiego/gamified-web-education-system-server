import { IsEmail, IsNotEmpty } from "class-validator";

export class PasswordRecovery {

    @IsNotEmpty({
        message: 'Email obrigatório'
    })
    @IsEmail()
    email: string;
    
}