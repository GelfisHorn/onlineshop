import { useEffect } from "react";

export default function PayPalButton({ value, currency, setPaymentDetails }) {

    useEffect(() => {
        if(window.paypal) {
            paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value, // Payment amount
                                    currency_code: currency
                                },
                            },
                        ],
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then((details) => {
                        setPaymentDetails(details);
                    });
                },
            }).render('#paypal-button-container');
        }
    }, [window.paypal]);

    return <div id="paypal-button-container"></div>;
}