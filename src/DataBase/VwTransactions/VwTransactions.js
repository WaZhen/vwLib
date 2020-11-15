export default class VwTransaction {
    static transaction(vwTransactionName, trnFunction) {
        let newVwTransaction;
        const existVWTransaction = theRoot.existTrans();

        if (!existVWTransaction) {
            newVwTransaction = theRoot.beginTrans(vwTransactionName);
        }

        if (existVWTransaction || newVwTransaction) {
            trnFunction();
        }

        if (newVwTransaction) {
            theRoot.commitTrans();
        }
    }
}