export default class VwRequest {
    static send({
        method = "GET",
        data = undefined,
        async = true,
        contentType = 'application/json; charset=UTF-8',
        headers = {},
        timeout = 5000,
        success = res => {
            alert(JSON.stringify(res, undefined, 2))
        },
        error = e => {
            alert(JSON.stringify(e, undefined, 2))
        },
        url
    }) {
        importClass("XMLHttpRequest");
        const request = new XMLHttpRequest();
        request.timeout = timeout;
        request.open(method, url, async);

        for (let i in headers) {
            const key = i;
            const value = headers[i];
            request.setRequestHeader(key, value);
        }

        request.setRequestHeader("Content-Type", contentType);
        data ? request.send(JSON.stringify(data)) : request.send();

        if (async) {
            while (request.readyState != 4) {
                request.processEvents();
            }
            request.waitForRequestComplete();
        }

        const requestSuccess = request.status >= 200 && request.status < 300;

        if (requestSuccess) {
            success(request);
        } else {
            error(request);
        }
    }
}