"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var prompt = require("prompt-sync")();
var csv = require('csv-parser');
var Account_1 = require("./Account");
var Transaction_1 = require("./Transaction");
var log4js = require("log4js");
var Accounts = [];
var Transactions = [];
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug' }
    }
});
var logger = log4js.getLogger("SupportBank.ts");
logger.debug("\n\n\nDebugging SupportBank");
function supportBank() {
    var transactions = [];
    fs.createReadStream('DoggyTransactions2014.csv')
        .pipe(csv())
        .on('data', function (data) { return transactions.push(data); })
        .on('end', function () {
        createAccounts(transactions);
        createTransactions(transactions);
        fs.readFile('Transactions2013.json', 'utf-8', function (err, data) {
            console.log("Reading JSON");
            if (err) {
                console.error(err);
                logger.fatal("Error reading file!");
                return;
            }
            var object = JSON.parse(data);
            // createAccounts(object)
            // main();
        });
    });
    console.log(transactions);
}
function createAccounts(transactions) {
    var names = transactions.map(function (line) {
        return [line.From, line.To];
    });
    for (var i = 0; i < names.length; i++) {
        for (var x = 0; x < names[i].length; x++) {
            logger.debug("Creating account with " + names[i][x]);
            if (!findAccount(names[i][x]))
                Accounts.push(new Account_1.default(names[i][x]));
            else {
                logger.debug("Account " + names[i][x] + " already exists!");
            }
        }
    }
}
function findAccount(name) {
    //Use this to parse in a name, and it will search and return the account or false if not exists
    for (var x = 0; x < Accounts.length; x++) {
        if (Accounts[x].getName() === name)
            return Accounts[x];
    }
    return false;
}
function createTransactions(transactions) {
    transactions.map(function (transaction) {
        try {
            if (Object.keys(transaction).length != 5)
                throw "Incorrect Number of Inputs";
            var sender = findAccount(transaction.From);
            var recipient = findAccount(transaction.To);
            if (isNaN(Number(transaction.Amount)))
                throw "Invalid Price Entered";
            var price = Number(transaction.amount);
            if (!sender || !recipient) {
                console.log("Invalid Accounts");
                logger.warn("Transaction made with non-existing accounts. Accounts: " + transaction.From.concat(transaction.To));
            }
            else {
                sender.changeBalance((price * -1));
                recipient.changeBalance(price);
                logger.debug("Transaction Created with info: " + JSON.stringify(transaction));
                Transactions.push(new Transaction_1.default(transaction.Date, sender, recipient, transaction.Narrative, price));
            }
        }
        catch (error) {
            logger.error("Transaction failed with error " + error + ": " + transaction.Amount);
        }
    });
}
function listAll() {
    console.log("Listing all accounts!");
    for (var x in Accounts)
        console.log(Accounts[x].toString());
}
function list(usrInput) {
    usrInput = usrInput.split(",");
    usrInput.shift();
    var name = usrInput.join(" ");
    var Account = findAccount(name);
    if (!Account) {
        console.log("Account doesnt exist!");
        return;
    }
    else {
        console.log("Listing Transactions made by " + name);
        for (var x = 0; x < Transactions.length; x++) {
            var sender = Transactions[x].getSender().getName();
            var recipient = Transactions[x].getRecipient().getName();
            if (sender === name || recipient === name) {
                console.log(Transactions[x].toString());
            }
        }
    }
}
function main() {
    console.log("Welcome to SupportBank™\n There are currently two options:\n1.List All \n2.List[Account]");
    var input = prompt("Enter your input: ").split(" ");
    while (input[0] != "List") {
        input = prompt("Enter a valid input!").split(" ");
    }
    var command = input.join();
    if (command === "List,All")
        listAll();
    else {
        list(command);
    }
}
supportBank();
