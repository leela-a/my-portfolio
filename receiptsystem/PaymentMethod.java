package Assignment.receiptsystem;
public interface PaymentMethod {
    String getType();
}

class Cash implements PaymentMethod {
    @Override
    public String getType() {
        return "Cash";
    }
}

class CreditCard implements PaymentMethod {
    private final String cardNumber;

    public CreditCard(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    @Override
    public String getType() {
        return "Credit Card (**** " + cardNumber.substring(cardNumber.length() - 4) + ")";
    }
}