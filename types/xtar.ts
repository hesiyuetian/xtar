import Vue from 'vue'
import { XtarComponent } from './component'

import { XtarDate } from './date'
import { XtarPaginator } from './paginator'
import { XtarSlide } from './slide'


/** The version of element-ui */
// export const version: string

/**
 * Install all element-ui components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(ElementUI)` to install.
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
   * Call `Vue.use(ElementUI)` to install.
   */
// export function install (vue: typeof Vue, options: InstallationOptions): void
export const install = function (vue: typeof Vue, opts = {}) {};

/** ElementUI component common definition */
export type Component = XtarComponent

/** Alert Component */
export class Date extends XtarDate {}

/** Aside Component */
export class Paginator extends XtarPaginator {}

/** Autocomplete Component */
export class Slide extends XtarSlide {}