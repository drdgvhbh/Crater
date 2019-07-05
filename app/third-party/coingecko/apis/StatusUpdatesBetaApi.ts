// tslint:disable
/**
 * CoinGecko API V3
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 3.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Observable } from 'rxjs';
import {
  BaseAPI,
  RequiredError,
  HttpHeaders,
  HttpQuery,
  COLLECTION_FORMATS,
} from '../runtime';

export interface StatusUpdatesGetRequest {
  category?: string;
  projectType?: string;
  perPage?: number;
  page?: number;
}

/**
 * no description
 */
export class StatusUpdatesBetaApi extends BaseAPI {
  /**
   * List all status_updates with data (description, category, created_at, user, user_title and pin)
   * List all status_updates with data (description, category, created_at, user, user_title and pin)
   */
  statusUpdatesGet(
    requestParameters: StatusUpdatesGetRequest,
  ): Observable<void> {
    const queryParameters: HttpQuery = {};

    if (
      requestParameters.category !== undefined &&
      requestParameters.category !== null
    ) {
      queryParameters['category'] = requestParameters.category;
    }

    if (
      requestParameters.projectType !== undefined &&
      requestParameters.projectType !== null
    ) {
      queryParameters['project_type'] = requestParameters.projectType;
    }

    if (
      requestParameters.perPage !== undefined &&
      requestParameters.perPage !== null
    ) {
      queryParameters['per_page'] = requestParameters.perPage;
    }

    if (
      requestParameters.page !== undefined &&
      requestParameters.page !== null
    ) {
      queryParameters['page'] = requestParameters.page;
    }

    const headerParameters: HttpHeaders = {};

    return this.request<void>({
      path: `/status_updates`,
      method: 'GET',
      headers: headerParameters,
      query: queryParameters,
    });
  }
}
