"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction = /** @class */ (function () {
    function Transaction(date, sender, recipient, narrative, amount) {
        this.date = date;
        this.sender = sender;
        this.recipient = recipient;
        this.narrative = narrative;
        this.amount = amount;
    }
    Transaction.prototype.getSender = function () {
        return this.sender;
    };
    Transaction.prototype.getRecipient = function () {
        return this.recipient;
    };
    Transaction.prototype.toString = function () {
        return "Date:" + this.date + "\nSender:" + this.sender.getName() + "\nRecipient:" + this.recipient.getName() + "\nNarrative:" + this.narrative + "\nAmount:" + this.amount + "\n";
    };
    return Transaction;
}());
exports.default = Transaction;
