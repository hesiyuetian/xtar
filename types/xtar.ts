import Vue from 'vue'
import { XtarComponent } from './component'

import { XtarPaginator } from './paginator'
import { XtarLoad } from './load'
import { XtarNoData } from './nodata'
import { XtarMarket } from './market'
import { XtarOrderList } from './orderlist'


/** The version of element-ui */
// export const version: string

/**
 * Install all element-ui components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(xtar)` to install.
 */
// export function install (vue: typeof Vue, options: {}): void

// export interface InstallationOptions {
//     locale: any,
//     i18n: any,
//     size: string
//   }
  
  /** The version of element-ui */
//   export const version: string
  
  /**
   * Install all element-ui components into Vue.
   * Please do not invoke this method directly.
   * Call `Vue.use(xtar)` to install.
   */
// export function install (vue: typeof Vue, options: InstallationOptions): void
export const install = function (vue: typeof Vue, opts = {}) {};

/** xtar component common definition */
export type Component = XtarComponent

/** Paginator Component */
export class Paginator extends XtarPaginator {}

/** Load Component */
export class Load extends XtarLoad {}

/** NoData Component */
export class NoData extends XtarNoData {}

/** Market Component */
export class Market extends XtarMarket {}

/** OrderList Component */
export class OrderList extends XtarOrderList {}
