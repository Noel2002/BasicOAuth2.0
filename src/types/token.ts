export type AccessTokenPayload = {
    iss: string;
    exp: number;
    aud: string;
    sub: string;
    client_id: string;
    iat: number;
    jti: string;
    scope: string;
}