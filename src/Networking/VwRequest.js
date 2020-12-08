/**
 * Class for using XmlHttpRequest
 */
export default class VwRequest {
    /**
     * 
     * @param {string} [method=GET] - String with the http method
     * @param {object} [data=undefined] - Required for POST/PUT/DELETE/PATCH methods
     * @param {boolean} [async=true]
     * @param {string} [contentType=application/json; charset=UTF-8] - Override if other content type
     * @param {string} [headers={}] - Additional request headers
     * @param {int} [timeout=5000] - Max waiting time in miliseconds
     * @param {function} success - Function to call if success
     * @param {function} error - Function to call if unsuccessful response
     * @param {string} url - request endpoint
     */
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