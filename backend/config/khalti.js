const khaltiConfig = {
    secretKey: process.env.KHALTI_SECRET_KEY || 'your_khalti_secret_key_here',
    // Use test URL for development, production URL for live
    apiUrl: process.env.KHALTI_ENV === 'production' 
        ? 'https://khalti.com/api/v2' 
        : 'https://dev.khalti.com/api/v2',
    publicKey: process.env.KHALTI_PUBLIC_KEY || 'your_khalti_public_key_here',
    returnUrl: process.env.KHALTI_RETURN_URL || 'http://localhost:5173/payment/verify',
    websiteUrl: process.env.KHALTI_WEBSITE_URL || 'http://localhost:5173'
};

export default khaltiConfig;
