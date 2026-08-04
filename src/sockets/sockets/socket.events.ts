export const SOCKET_EVENTS = {
  //************** EMIT *****************//
  VENDOR_JOIN: 'vendor_join',
  VENDOR_ONBOARD_DRIVER: 'vendor:onboard_driver',
  VENDOR_ASSIGN_DRIVER: 'vendor:assign_driver',

  //************** ON *****************//
  VENDOR_ONBOARD_DRIVER_RESPONSE: 'vendor:onboard_driver',
  VENDOR_ASSIGN_DRIVER_RESPONSE: 'vendor:assign_driver',
} as const;