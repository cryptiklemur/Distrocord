export default class MultipartData {
    private boundary;
    private bufs;
    attach(fieldName: any, data: any, filename: any): void;
    finish(): any[];
}
