const Decimal = require('decimal.js');

Decimal.set({ rounding: Decimal.ROUND_HALF_EVEN });

const conversionRates = {
    USD: 1,
    AUD: 0.74,
    EUR: 1.18
};

const acceptedConversionRates = Object.keys(conversionRates);

const convertAmountToTargetCurrency = (amount, originalCurrency, targetCurrency) => {
    if (originalCurrency === targetCurrency) {
        return amount;
    }

    if (!conversionRates[originalCurrency] || !conversionRates[targetCurrency]) {
        throw new Error('Invalid currencies for conversion');
    }

    const targetRateDecimal = new Decimal(conversionRates[targetCurrency]);
    const multiplierDecimal = targetRateDecimal.dividedBy(conversionRates[originalCurrency]);

    const convertedAmountDecimal = new Decimal(amount).times(multiplierDecimal).round();
    return convertedAmountDecimal.toNumber();
};

module.exports = {
    acceptedConversionRates,
    convertAmountToTargetCurrency
};