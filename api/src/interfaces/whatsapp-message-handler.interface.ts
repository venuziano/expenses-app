export interface MessageHandler {
  /**
   * Should I handle this message?
   * e.g. /^quanto eu gastei/i.test(text)
   */
  canHandle(text: string): boolean;
  /**
   * Do the work: create expense or answer a query
   */
  handle(text: string, userId: number): Promise<string>;
}
