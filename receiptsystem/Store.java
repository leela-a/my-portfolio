package Assignment.receiptsystem;

import java.util.ArrayList;

public class Store {
    private final String name;
    private final String category;
    private final ArrayList<Receipt> receipts = new ArrayList<>();

    public Store(String name, String category) {
        this.name = name;
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public void addReceipt(Receipt receipt) {
        receipts.add(receipt);
    }

    public void viewReceipts() {
        for (Receipt receipt : receipts) {
            receipt.displayReceipt();
        }
    }
}