package Assignment.receiptsystem;

import java.text.DecimalFormat;
import java.util.ArrayList;

public class Receipt {
    private final int id;
    private Store store;
    private Customer customer;
    private final ArrayList<Item> items = new ArrayList<>();
    private double totalAmount;
    private PaymentMethod paymentMethod;

    public Receipt(int id) {
        this.id = id;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void addItem(Item item) {
        items.add(item);
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {this.paymentMethod = paymentMethod;}

    public void calculateTotal() {
        totalAmount = items.stream().mapToDouble(Item::getTotalPrice).sum();
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void displayReceipt() {
        DecimalFormat df = new DecimalFormat("#.00");
        System.out.println("Receipt ID: " + id + "," + " Store: " + (store != null ? store.getName() : "N/A"));
        System.out.println("Customer: " + (customer != null ? customer.getName() : "N/A") + "," + " Payment Method: " +
                (paymentMethod != null ? paymentMethod.getType() : "N/A"));
        // Display payment method
        for (Item item : items) {
            System.out.println("- " + item.getName() + ": $" + item.getPrice() + " x " + item.getQuantity());
        }
        System.out.println("Total: $" + totalAmount);
        /*System.out.println("Receipt ID: " + id + ", Store: " + store.getName() + ", Customer: " + customer.getName());
        for (Item item : items) {
            System.out.println("- " + item.getName() + ": $" + item.getPrice() + " x " + item.getQuantity());
        }
        System.out.println("Total: $" + df.format(totalAmount));*/
    }
}