export enum Status {

  APPROVED = "Approved",
  PENDING = "Pending",
  REJECTED = "Rejected",
  EXPIRED = "Expired"

}

export const StatusValues: {[key in Status]: string} = {
  [Status.APPROVED]: 'Approved',
  [Status.PENDING]: 'Pending',
  [Status.REJECTED]: 'Rejected',
  [Status.EXPIRED]: 'Expired'
}

export function getStatusValue(status: Status): string {
  return StatusValues[status];
}
