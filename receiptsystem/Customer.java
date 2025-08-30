package Assignment.receiptsystem;

import java.util.ArrayList;

public class Customer {
    private final String name;
    private final ArrayList<Receipt> receipts = new ArrayList<>();

    public Customer(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void addReceipt(Receipt receipt) {
        receipts.add(receipt);
    }

    public void viewReceipts() {
        if (receipts.isEmpty()) {
            System.out.println("No receipts found for customer: " + name);
            return;
        }
        for (Receipt receipt : receipts) {
            receipt.displayReceipt();
        }
    }
}