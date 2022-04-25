/**
 * @hideconstructor
 * @classdesc
 * Utilidades para {@link https://doc.velneo.es/b%C3%BAsquedas.html|Búsquedas}
 */

export default class VwQuery {
    /**
     * Lanza una {@link https://doc.velneo.es/b%C3%BAsquedas.html|Búsqueda}
     * @param {string} queryIdRef idRef del objeto tipo búsqueda aliasProyecto/idBusqueda
     * @param {object} queryArguments Json. Poner los IDs de las variables locales de la búsqueda en las claves, y resolver en los valores
     * @returns {VRegisterList} {@link https://doc.velneo.es/vregisterlist.html|VRegisterList} de la api de velneo
     */
    static query(queryIdRef, queryArguments) {

        if (typeof queryIdRef !== 'string') {
            throw new Error('First parameter of VwQuery.query must be a string');
        }

        importClass("VQuery");
        const query = new VQuery(theRoot);
        query.setQuery(queryIdRef);

        for (key in queryArguments) {
            query.setVar(key, queryArguments[key]);
        }

        if (query.exec()) {
            return query.result();
        } else {
            throw new Error('Vquery execution failed');
        }
    }
}