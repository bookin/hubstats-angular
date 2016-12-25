export class AppConfig {
    public static get BACKEND_URL(): string { return AppConfig.HOST_NAME; }
    public static get HOST_NAME(): string { return location.origin; }
}