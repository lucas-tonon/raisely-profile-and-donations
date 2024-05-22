const { convertAmountToTargetCurrency } = require('../../../src/utils/convertRates');

describe('ConvertRates Utility', () => {
    describe('convertAmountToTargetCurrency', () => {
        test('should correctly convert from one accepted currency to another', () => {
            // Given
            const usdAmount = 1000;
            const expectedAudAmount = 740;

            // When
            const result = convertAmountToTargetCurrency(usdAmount, 'USD', 'AUD');

            // Then
            expect(result).toEqual(expectedAudAmount);
        });

        test('should return amount as is if target currency is same as original currency', () => {
            // Given
            const usdAmount = 1000;

            // When
            const result = convertAmountToTargetCurrency(usdAmount, 'USD', 'USD');

            // Then
            expect(result).toBe(usdAmount);

        });

        test('should throw error if there is attempt to convert unsupported currencies', () => {
            expect(() => convertAmountToTargetCurrency(1000, 'USD', 'BRL')).toThrow('Invalid currency');
        });
    });
});