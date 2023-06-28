"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
function supportBank(val) {
    return __awaiter(this, void 0, void 0, function () {
        var transactions;
        return __generator(this, function (_a) {
            transactions = [];
            if (val.split('.').pop() === "csv") {
                fs.createReadStream('DoggyTransactions2014.csv')
                    .pipe(csv())
                    .on('data', function (data) { return transactions.push(data); })
                    .on('end', function () {
                    createAccounts(transactions);
                    createTransactions(transactions);
                });
            }
            else {
                fs.readFile('Transactions2013.json', 'utf-8', function (err, data) {
                    console.log("Reading JSON");
                    if (err) {
                        console.error(err);
                        logger.fatal("Error reading file!");
                        return;
                    }
                    var object = JSON.parse(data);
                    createAccounts(object);
                    createTransactions(object);
                    main();
                });
            }
            return [2 /*return*/];
        });
    });
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
            var price = Number(transaction.Amount);
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
process.argv.forEach(function (val, index) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(val);
                    if (!(index >= 2)) return [3 /*break*/, 2];
                    return [4 /*yield*/, supportBank(val)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
});
// main();
