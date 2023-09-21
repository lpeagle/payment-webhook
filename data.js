class Transaction{

    constructor(id, transactiontype,date, amount){
        this.id = id;
        this.transactiontype = transactiontype
        this.date = date
        this.amount = amount
        this.merchant =""
        this.reconcileStatus = "NotReconciled"
    }



}

class Report{

    constructor(id, transactiontype,date, amount){
        this.id = id;
        this.transactiontype = transactiontype
        this.date = date
        this.amount = amount
        // default seller part
        this.splitId ="0"
        this.destinationAccount =""
        this.merchant=""
    }

    

}

module.exports={Transaction, Report}