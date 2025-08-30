package Assignment.receiptsystem;

import java.util.ArrayList;
import java.util.Scanner;

public class ReceiptSystem {
    private static int receiptCounter = 0;
    private static final double TAX_RATE = 0.013; // tax rate of 1.3%

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);


        // Create lists to store receipts, customers, and stores
        ArrayList<Receipt> receipts = new ArrayList<>();
        ArrayList<Customer> customers = new ArrayList<>();
        ArrayList<Store> stores = new ArrayList<>();
        initializeStores(stores);

        // Main loop to interact with the user
        while (true) {
            System.out.println("1. Add Receipt");
            System.out.println("2. View Receipts");
            System.out.println("3. Generate Reports");
            System.out.println("4. Exit");
            System.out.print("Enter your choice: ");
            int choice = getValidInteger(scanner);

            switch (choice) {
                case 1:
                    // Add a receipt
                    Receipt receipt = new Receipt(++receiptCounter);
                    System.out.println("Enter store name: ");
                    String storeName = scanner.next();
                    scanner.nextLine();

                    // Check if the store already exists before adding it
                    Store store = findStoreByName(stores, storeName);
                    if (store == null) {
                        store = new Store(storeName, "General");
                        stores.add(store);
                    }
                    receipt.setStore(store);

                    System.out.println("Enter customer name: ");
                    String customerName = scanner.next();
                    scanner.nextLine();

                    // Check if the customer already exists before adding it
                    Customer customer = findCustomerByName(customers, customerName);
                    if (customer == null) {
                        customer = new Customer(customerName);
                        customers.add(customer);
                    }
                    receipt.setCustomer(customer);

                    System.out.println("Select payment method (1 for Cash, 2 for Credit Card): ");
                    int paymentChoice = Integer.parseInt(scanner.nextLine());
                    PaymentMethod paymentMethod;

                    if (paymentChoice == 1) {
                        paymentMethod = new Cash();
                    } else if (paymentChoice == 2) {
                        System.out.println("Enter credit card number: ");
                        String cardNumber = scanner.nextLine();
                        paymentMethod = new CreditCard(cardNumber);
                    } else {
                        System.out.println("Invalid choice. Defaulting to Cash.");
                        paymentMethod = new Cash();
                    }

                    receipt.setPaymentMethod(paymentMethod);

                    // Add items to the receipt
                    while (true) {
                        System.out.println("Enter item name (or 'done' to finish): ");
                        String itemName = scanner.nextLine();
                        if (itemName.equalsIgnoreCase("done")) {
                            break;
                        }
                        double price = getValidDouble(scanner, "Enter item price: ");
                        int quantity = getValidInteger(scanner, "Enter item quantity: ");
                        Item item = new Item(itemName, price, quantity);
                        receipt.addItem(item);
                    }

                    // Calculate total and add receipt to lists
                    receipt.calculateTotal();
                    receipts.add(receipt);
                    store.addReceipt(receipt);
                    customer.addReceipt(receipt);
                    break;

                case 2:
                    // View receipts
                    System.out.println("View receipts by:");
                    System.out.println("1. Customer");
                    System.out.println("2. Store");
                    System.out.print("Enter your choice: ");
                    int viewChoice = scanner.nextInt();
                    scanner.nextLine();

                    if (viewChoice == 1) {
                        System.out.print("Enter customer name: ");
                        String customerNameToView = scanner.nextLine();
                        Customer customerToView = findCustomerByName(customers, customerNameToView);
                        if (customerToView != null) {
                            customerToView.viewReceipts();
                        } else {
                            System.out.println("Customer not found.");
                        }
                    } else if (viewChoice == 2) {
                        System.out.print("Enter store name: ");
                        String storeNameToView = scanner.nextLine();
                        Store storeToView = findStoreByName(stores, storeNameToView);
                        if (storeToView != null) {
                            storeToView.viewReceipts();
                        } else {
                            System.out.println("Store not found.");
                        }
                    }
                    break;

                case 3:
                    System.out.println("All Receipts:");
                    for (Receipt r : receipts) {
                        r.displayReceipt();
                    }
                    break;

                case 4:
                    // Exit
                    System.out.println("Exiting...");
                    scanner.close();
                    System.exit(0);
            }
        }
    }

    private static void initializeStores(ArrayList<Store> stores) {
        stores.add(new Store("Walmart", "Grocery"));
        stores.add(new Store("Target", "Clothing"));
        stores.add(new Store("Best Buy", "Electronics"));
        stores.add(new Store("Dollar Store", "Discount"));
    }

    // Helper methods
    private static Customer findCustomerByName(ArrayList<Customer> customers, String name) {
        for (Customer customer : customers) {
            if (customer.getName().equalsIgnoreCase(name)) {
                return customer;
            }
        }
        return null;
    }

    private static Store findStoreByName(ArrayList<Store> stores, String name) {
        for (Store store : stores) {
            if (store.getName().equalsIgnoreCase(name)) {
                return store;
            }
        }
        return null;
    }

    private static int getValidInteger(Scanner scanner) {
        while (true) {
            String input = scanner.nextLine();
            try {
                return Integer.parseInt(input);
            } catch (NumberFormatException e) {
                System.out.print("Invalid input. Please enter a valid integer: ");
            }
        }
    }

    private static int getValidInteger(Scanner scanner, String prompt) {
        System.out.print(prompt);
        return getValidInteger(scanner);
    }

    private static double getValidDouble(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine();
            try {
                return Double.parseDouble(input);
            } catch (NumberFormatException e) {
                System.out.print("Invalid input. Please enter a valid number: ");
            }
        }
    }
}