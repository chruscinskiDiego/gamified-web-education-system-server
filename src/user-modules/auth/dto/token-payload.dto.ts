export class TokenPayloadDto {
    sub: number;
    email: string;
    role: string;
    iat: number;
    exp: number;
    aud: string;
    iss: string;
}