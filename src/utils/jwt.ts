export type JwtPayload = {
    id: number;
    username: string;
    rol: string;
    iat?: number;
    exp?: number;
};

function b64urlDecode(input: string): string {
    const pad = "=".repeat((4 - (input.length % 4)) % 4);
    const base64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    try {
        return decodeURIComponent(
        decoded
            .split("")
            .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("")
        );
    } catch {
        return decoded;
    }
}

export function decodeJwt(token: string): JwtPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        return JSON.parse(b64urlDecode(parts[1])) as JwtPayload;
    } catch {
        return null;
    }
}

export function isJwtExpired(token: string): boolean {
    const payload = decodeJwt(token);
    if (!payload?.exp) return false;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowSeconds;
}
