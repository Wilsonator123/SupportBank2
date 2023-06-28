"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Account = /** @class */ (function () {
    function Account(name) {
        this.balance = "";
        this.name = name;
        this.balance = "0.00";
    }
    Account.prototype.changeBalance = function (price) {
        var change = Number(this.balance) + price;
        this.balance = (Math.round(change * 100) / 100).toFixed(2);
    };
    Account.prototype.getBalance = function () {
        return this.balance;
    };
    Account.prototype.getName = function () {
        return this.name;
    };
    Account.prototype.toString = function () {
        return "Name: " + this.name + "\nBalance: " + this.balance + "\n";
    };
    return Account;
}());
exports.default = Account;
