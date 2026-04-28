declare module "iyzipay" {
  export interface IyzipayConfig {
    apiKey: string;
    secretKey: string;
    uri: string;
  }

  export interface PaymentRetrieveRequest {
    locale?: "tr" | "en";
    conversationId?: string;
    paymentId: string;
    paymentConversationId: string;
  }

  export interface IyzicoFailureResponse {
    status: "failure";
    errorCode?: string;
    errorMessage?: string;
    errorGroup?: string;
    locale?: string;
  }

  export type IyzicoResponse = IyzicoFailureResponse | Record<string, unknown>;

  export type Callback = (err: unknown, result: IyzicoResponse) => void;

  export interface PaymentResource {
    retrieve(request: PaymentRetrieveRequest, cb: Callback): void;
  }

  export interface ReportingTransactionsRetrieveRequest {
    locale?: "tr" | "en";
    conversationId?: string;
    transactionDate: string;
    page?: number;
  }

  export interface ReportingTransactionsResource {
    retrieve(request: ReportingTransactionsRetrieveRequest, cb: Callback): void;
  }

  export default class Iyzipay {
    constructor(config: IyzipayConfig);
    payment: PaymentResource;
    reportingTransactions: ReportingTransactionsResource;
  }
}
