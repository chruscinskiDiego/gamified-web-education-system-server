export class TokenPayloadDto {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
    aud: string;
    iss: string;
}