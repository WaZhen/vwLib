/**
 * @classdesc
 * Herramientas XmlHttpRequest
 * @hideconstructor
 */
export default class VwRequest {
    /**
     * 
     * @param {string} [method=GET] - método http
     * @param {object} [data=undefined] - Cuerpo. Obligatorio para los métodos POST/PUT/DELETE/PATCH
     * @param {boolean} [async=true]
     * @param {string} [contentType=application/json; charset=UTF-8]
     * @param {string} [headers={}] - Cabeceras adicionales
     * @param {int} [timeout=5000] - Tiempo máximo de espera en milisegundos
     * @param {function} [success] - Callback para gestionar peticiones con éxito
     * @param {function} [error] - Callback para gestionar peticiones fallidas
     * @param {string} url
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