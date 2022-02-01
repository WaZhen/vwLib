/**
 * Class for use velneo queries {@link https://doc.velneo.es/b%C3%BAsquedas.html|Búsquedas}
 */
export default class VwQuery {
    /**
     * @static Method to use a velneo query {@link https://doc.velneo.es/b%C3%BAsquedas.html|Búsquedas}
     * @param {string} queryIdRef idRef of the velneo query object
     * @param {object} queryArguments JSON. The keys are the query object local variables. The values are setted in the variables
     * @returns {VRegisterList} velneoVRegisterList {@link https://doc.velneo.es/vregisterlist.html|VRegisterList}
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