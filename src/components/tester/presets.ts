export interface WebhookPreset {
    label: string;
    payload: Record<string, any>;
}

export const webhookPresets: WebhookPreset[] = [
    {
        label: 'Shopify - order.created',
        payload: {
            event: 'order.created',
            source: 'shopify',
            message: 'New order #1042 placed for $89.00',
        },
    },
    {
        label: 'Stripe - payment.success',
        payload: {
            event: 'payment.success',
            source: 'stripe',
            message: 'Payment of $50.00 received from customer #882',
        },
    },
    {
        label: 'Auth0 - user.signup',
        payload: {
            event: 'user.signup',
            source: 'auth0',
            message: 'New user registered: jane.doe@example.com',
        },
    },
    {
        label: 'Custom',
        payload: {
            event: '',
            source: '',
            message: '',
        },
    },
];