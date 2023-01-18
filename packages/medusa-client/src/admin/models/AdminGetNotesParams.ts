/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetNotesParams = {
  /**
   * The number of notes to get
   */
  limit?: number;
  /**
   * The offset at which to get notes
   */
  offset?: number;
  /**
   * The ID which the notes belongs to
   */
  resourceId?: string;
};

