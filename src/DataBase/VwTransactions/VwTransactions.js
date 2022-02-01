export default class VwTransaction {
    static transaction(vwTransactionName, trnFunction) {
        let newVwTransaction;
        const existVwTransaction = theRoot.existTrans();

        if (!existVwTransaction) {
            newVwTransaction = theRoot.beginTrans(vwTransactionName);
        }

        if (existVwTransaction || newVwTransaction) {
            trnFunction();
        }

        if (newVwTransaction) {
            theRoot.commitTrans();
        }
    }
}