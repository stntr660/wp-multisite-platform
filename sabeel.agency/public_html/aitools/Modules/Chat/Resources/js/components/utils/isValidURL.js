export function isValidURL(url) {
	// Regular expression for URL validation
	var urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
	// Test the URL against the regular expression
	return urlRegex.test(url);
}
