
export default class Account {
    private readonly name: string;
    private balance: string = "";
    constructor(name: string) {
        this.name = name;
        this.balance = "0.00";
    }

    changeBalance(price: number){
        let change = Number(this.balance) + price;
        this.balance = (Math.round(change * 100) / 100).toFixed(2);
    }

    getBalance(){
        return this.balance
    }

    getName(){
        return this.name
    }

    toString(){
        return "Name: " + this.name + "\nBalance: " + this.balance+"\n";
    }



}