export default class MultipartData {
    private boundary: string = "----------------DistroDiscord";
    private bufs: any[]      = [];

    public attach(fieldName, data, filename) {
        if (data === undefined) {
            return;
        }

        let str = "\r\n--" + this.boundary + "\r\nContent-Disposition: form-data; name=\"" + fieldName + "\"";
        if (filename) {
            str += "; filename=\"" + filename + "\"";
        }
        if (data instanceof Buffer) {
            str += "\r\nContent-Type: application/octet-stream";
        } else if (typeof data === "object") {
            str += "\r\nContent-Type: application/json";
            data = new Buffer(JSON.stringify(data));
        } else {
            data = new Buffer("" + data);
        }
        this.bufs.push(new Buffer(str + "\r\n\r\n"));
        this.bufs.push(data);
    }

    public finish() {
        this.bufs.push(new Buffer("\r\n--" + this.boundary + "--"));

        return this.bufs;
    }
}
