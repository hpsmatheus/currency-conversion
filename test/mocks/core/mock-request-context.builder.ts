import RequestContext from '../../../src/typings/request-context';
import Constants from '../../constants';

export default class MockRequestContextBuilder {
  private requestContext: RequestContext;

  constructor() {
    this.requestContext = new RequestContext();
    this.requestContext.stringfiedBody = JSON.stringify(Constants.anyObject);
    this.requestContext.trackId = Constants.anyUuid;
    this.requestContext.startTime = Date.now();
    this.requestContext.metadata = JSON.stringify({
      url: Constants.anyString,
      method: Constants.anyString,
      params: Constants.anyString,
      query: Constants.anyObject,
    });
  }

  public build(): RequestContext {
    return this.requestContext;
  }
}
