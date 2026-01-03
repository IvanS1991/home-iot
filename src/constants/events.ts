export const EVENT_STATUS = {
    success: 'success',
    error: 'error',
    info: 'info'
};

export type EventStatus = 'success' | 'error' | 'info';

export const EVENT_TYPE = {
    sensor: 'sensor',
    serial: 'serial',
    tcp: 'tcp',
    http: 'http',
    system: 'system'
};

export type EventType = 'sensor' | 'serial' | 'tcp' | 'http' | 'system';
