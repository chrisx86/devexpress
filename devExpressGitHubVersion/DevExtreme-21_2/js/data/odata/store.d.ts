import { DxPromise } from '../../core/utils/deferred';
import Store, { StoreOptions } from '../abstract_store';
import { LoadOptions } from '../index';
import { Query } from '../query';
import { ODataRequestOptions } from './context';

interface PromiseExtension<T> {
    then<TResult1 = T, TResult2 = never>(
        onFulfilled?: ((value: T, extraParameters?: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2>;
}

/** @namespace DevExpress.data */
export interface ODataStoreOptions<TKey = any, TValue = any> extends StoreOptions<TKey, TValue> {
    /**
     * @docid
     * @type_function_param1 options:object
     * @type_function_param1_field1 url:string
     * @type_function_param1_field2 async:boolean
     * @type_function_param1_field3 method:string
     * @type_function_param1_field4 timeout:number
     * @type_function_param1_field5 params:object
     * @type_function_param1_field6 payload:object
     * @type_function_param1_field7 headers:object
     * @public
     */
    beforeSend?: ((options: { url: string; async: boolean; method: string; timeout: number; params: any; payload: any; headers: any }) => void);
    /**
     * @docid
     * @public
     */
    deserializeDates?: boolean;
    /**
     * @docid
     * @type_function_param1 e:Error
     * @type_function_param1_field1 httpStatus:number
     * @type_function_param1_field2 errorDetails:object
     * @type_function_param1_field3 requestOptions:object
     * @public
     */
    errorHandler?: ((e: { httpStatus: number; errorDetails: any; requestOptions: ODataRequestOptions }) => void);
    /**
     * @docid
     * @default {}
     * @public
     */
    fieldTypes?: any;
    /**
     * @docid
     * @public
     */
    filterToLower?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    jsonp?: boolean;
    /**
     * @docid
     * @type string|object
     * @acceptValues "String"|"Int32"|"Int64"|"Guid"|"Boolean"|"Single"|"Decimal"
     * @public
     */
    keyType?: 'String' | 'Int32' | 'Int64' | 'Guid' | 'Boolean' | 'Single' | 'Decimal' | any;
    /**
     * @docid
     * @type_function_param1 loadOptions:LoadOptions
     * @action
     * @public
     */
    onLoading?: ((loadOptions: LoadOptions<TValue>) => void);
    /**
     * @docid
     * @public
     */
    url?: string;
    /**
     * @docid
     * @default 2
     * @acceptValues 2|3|4
     * @public
     */
    version?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    withCredentials?: boolean;
}
/**
 * @docid
 * @inherits Store
 * @module data/odata/store
 * @export default
 * @public
 */
export default class ODataStore<TKey = any, TValue = any> extends Store<TKey, TValue> {
    constructor(options?: ODataStoreOptions<TKey, TValue>)
    byKey(key: TKey): DxPromise<TValue>;
    /**
     * @docid
     * @publicName byKey(key, extraOptions)
     * @param1 key:object|string|number
     * @param2 extraOptions:object
     * @param2_field1 expand:string|Array<string>
     * @param2_field2 select:string|Array<string>
     * @return Promise<any>
     * @public
     */
    byKey(key: TKey, extraOptions: { expand?: string | Array<string>; select?: string | Array<string> }): DxPromise<TValue>;
    /**
     * @docid
     * @publicName createQuery(loadOptions)
     * @param1 loadOptions:object
     * @return object
     * @public
     */
    createQuery(loadOptions?: { expand?: string | Array<string>; requireTotalCount?: boolean; customQueryParams?: any }): Query;

    /**
     * @docid
     * @publicName insert(values)
     * @param1 values:object
     * @return Promise<any>
     * @public
     */
    insert(values: TValue): DxPromise<TValue> & PromiseExtension<TValue>;
}
