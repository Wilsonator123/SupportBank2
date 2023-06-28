import Account from "./Account"
export default class Transaction{
    date: string;
    sender: Account;
    recipient: Account;
    narrative: string;
    amount: Number;

    constructor(date: string, sender: Account, recipient: Account, narrative:string, amount:Number) {
        this.date = date;
        this.sender = sender;
        this.recipient = recipient;
        this.narrative=narrative;
        this.amount=amount;
    }

    getSender(){
        return this.sender;
    }

    getRecipient(){
        return this.recipient;
    }

    toString(){
        return "Date:"+this.date+"\nSender:"+this.sender.getName()+"\nRecipient:"+this.recipient.getName()+"\nNarrative:"+this.narrative+"\nAmount:"+this.amount+"\n";
    }
}


