const {Transaction, Report} = require('./data');
const CSV = require('csv-string');



class TrxManager {

    constructor() {

        this.transactions = []
        this.trxMap = new Map()
    }

    addTransaction(trxNotify) {
        for (let notifyItem of trxNotify.notificationItems) {
            console.log("notifyItem: %j", notifyItem);
            let transaction = new Transaction();
            transaction.amount = Number(notifyItem.NotificationRequestItem.amount.value) / 100;
            transaction.date = notifyItem.NotificationRequestItem.eventDate;
            transaction.id = notifyItem.NotificationRequestItem.pspReference.trim();
            transaction.merchant = notifyItem.NotificationRequestItem.merchantAccountCode;
            transaction.transactiontype = notifyItem.NotificationRequestItem.operations;
            this.transactions.push(transaction)
            this.trxMap.set(transaction.id, transaction);
            
        }

    }

    reconcile(report) {
        const index = CSV.read(report, ',', row => {
            console.log(row);
            let report = new Report();
            report.amount = Number(row[1])
            report.id = row[0]
            this.reconcileReportAgainstTrx(report)
          });
        console.log("Report processed. Transactions status:\n", this.transactions);

    }

    reconcileReportAgainstTrx(report){
        let trx = this.trxMap.get(report.id);

        if (!trx){
            console.log("Unfounded transaction " + report.id + " in report!");
            return
        }
        if (report.amount - trx.amount <=0.001){
            trx.reconcileStatus = "Reconciled";
        } else {
            trx.reconcileStatus = "ReconcilFailed";
        }

    }


}

module.exports = { TrxManager };