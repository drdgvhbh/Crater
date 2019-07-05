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

export interface SimplePriceGetRequest {
  ids: string;
  vsCurrencies: string;
  includeMarketCap?: string;
  include24hrVol?: string;
  include24hrChange?: string;
  includeLastUpdatedAt?: string;
}

export interface SimpleTokenPriceIdGetRequest {
  id: string;
  contractAddresses: string;
  vsCurrencies: string;
  includeMarketCap?: string;
  include24hrVol?: string;
  include24hrChange?: string;
  includeLastUpdatedAt?: string;
}

/**
 * no description
 */
export class SimpleApi extends BaseAPI {
  /**
   * Get the current price of any cryptocurrencies in any other supported currencies that you need.
   */
  simplePriceGet(
    requestParameters: SimplePriceGetRequest,
  ): Observable<{ [key: string]: { [key: string]: number } }> {
    if (requestParameters.ids === null || requestParameters.ids === undefined) {
      throw new RequiredError(
        'ids',
        'Required parameter requestParameters.ids was null or undefined when calling simplePriceGet.',
      );
    }

    if (
      requestParameters.vsCurrencies === null ||
      requestParameters.vsCurrencies === undefined
    ) {
      throw new RequiredError(
        'vsCurrencies',
        'Required parameter requestParameters.vsCurrencies was null or undefined when calling simplePriceGet.',
      );
    }

    const queryParameters: HttpQuery = {};

    if (requestParameters.ids !== undefined && requestParameters.ids !== null) {
      queryParameters['ids'] = requestParameters.ids;
    }

    if (
      requestParameters.vsCurrencies !== undefined &&
      requestParameters.vsCurrencies !== null
    ) {
      queryParameters['vs_currencies'] = requestParameters.vsCurrencies;
    }

    if (
      requestParameters.includeMarketCap !== undefined &&
      requestParameters.includeMarketCap !== null
    ) {
      queryParameters['include_market_cap'] =
        requestParameters.includeMarketCap;
    }

    if (
      requestParameters.include24hrVol !== undefined &&
      requestParameters.include24hrVol !== null
    ) {
      queryParameters['include_24hr_vol'] = requestParameters.include24hrVol;
    }

    if (
      requestParameters.include24hrChange !== undefined &&
      requestParameters.include24hrChange !== null
    ) {
      queryParameters['include_24hr_change'] =
        requestParameters.include24hrChange;
    }

    if (
      requestParameters.includeLastUpdatedAt !== undefined &&
      requestParameters.includeLastUpdatedAt !== null
    ) {
      queryParameters['include_last_updated_at'] =
        requestParameters.includeLastUpdatedAt;
    }

    const headerParameters: HttpHeaders = {};

    return this.request<{ [key: string]: { [key: string]: number } }>({
      path: `/simple/price`,
      method: 'GET',
      headers: headerParameters,
      query: queryParameters,
    });
  }

  /**
   * Get list of supported_vs_currencies.
   */
  simpleSupportedVsCurrenciesGet(): Observable<void> {
    const queryParameters: HttpQuery = {};

    const headerParameters: HttpHeaders = {};

    return this.request<void>({
      path: `/simple/supported_vs_currencies`,
      method: 'GET',
      headers: headerParameters,
      query: queryParameters,
    });
  }

  /**
   * Get current price of tokens (using contract addresses) for a given platform in any other currency that you need.
   */
  simpleTokenPriceIdGet(
    requestParameters: SimpleTokenPriceIdGetRequest,
  ): Observable<void> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new RequiredError(
        'id',
        'Required parameter requestParameters.id was null or undefined when calling simpleTokenPriceIdGet.',
      );
    }

    if (
      requestParameters.contractAddresses === null ||
      requestParameters.contractAddresses === undefined
    ) {
      throw new RequiredError(
        'contractAddresses',
        'Required parameter requestParameters.contractAddresses was null or undefined when calling simpleTokenPriceIdGet.',
      );
    }

    if (
      requestParameters.vsCurrencies === null ||
      requestParameters.vsCurrencies === undefined
    ) {
      throw new RequiredError(
        'vsCurrencies',
        'Required parameter requestParameters.vsCurrencies was null or undefined when calling simpleTokenPriceIdGet.',
      );
    }

    const queryParameters: HttpQuery = {};

    if (
      requestParameters.contractAddresses !== undefined &&
      requestParameters.contractAddresses !== null
    ) {
      queryParameters['contract_addresses'] =
        requestParameters.contractAddresses;
    }

    if (
      requestParameters.vsCurrencies !== undefined &&
      requestParameters.vsCurrencies !== null
    ) {
      queryParameters['vs_currencies'] = requestParameters.vsCurrencies;
    }

    if (
      requestParameters.includeMarketCap !== undefined &&
      requestParameters.includeMarketCap !== null
    ) {
      queryParameters['include_market_cap'] =
        requestParameters.includeMarketCap;
    }

    if (
      requestParameters.include24hrVol !== undefined &&
      requestParameters.include24hrVol !== null
    ) {
      queryParameters['include_24hr_vol'] = requestParameters.include24hrVol;
    }

    if (
      requestParameters.include24hrChange !== undefined &&
      requestParameters.include24hrChange !== null
    ) {
      queryParameters['include_24hr_change'] =
        requestParameters.include24hrChange;
    }

    if (
      requestParameters.includeLastUpdatedAt !== undefined &&
      requestParameters.includeLastUpdatedAt !== null
    ) {
      queryParameters['include_last_updated_at'] =
        requestParameters.includeLastUpdatedAt;
    }

    const headerParameters: HttpHeaders = {};

    return this.request<void>({
      path: `/simple/token_price/{id}`.replace(
        `{${'id'}}`,
        encodeURIComponent(String(requestParameters.id)),
      ),
      method: 'GET',
      headers: headerParameters,
      query: queryParameters,
    });
  }
}
