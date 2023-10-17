export const formatPrice = ({price = 0, currency = "USD"}): string => {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency
	});

	return formatter.format(price / 100)
}