type LinkingErrorMessageInput = {
    moduleA: string;
    moduleAKey: string;
    moduleB: string;
    moduleBKey: string;
    type: "dismiss" | "link";
};
/**
 *
 * Example: Module to dismiss salesChannel and apiKey by keys sales_channel_id and api_key_id was not found. Ensure the link exists, keys are correct, and the link is passed in the correct order to method 'remoteLink.dismiss'
 */
export declare const linkingErrorMessage: (input: LinkingErrorMessageInput) => string;
export {};
